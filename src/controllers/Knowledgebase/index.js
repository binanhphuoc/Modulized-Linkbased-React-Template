import axios from 'axios';

import models from "./FieldMeta";

class SerializerError {
  
  static MODEL_NOT_FOUND = "model_not_found";
  static NO_DETAIL_IN_PATH = "no_detail_in_path";

  constructor(code, message) {
    this.errorCode = code;
    this.errorMessage = message;
  }

  code = () => {
    return this.errorCode;
  }

  message = () => {
    return this.errorMessage;
  }
}

class SerializerBase {
  static instance = null;
  static decision = {
    RESET_VIEWS: 100,
    NAVIGATE_DETAIL: 200,
    SWITCH_DETAIL: 210,
    EMPTY_DETAIL: 220,
    NAVIGATE_COLLECTION: 300,
    SWITCH_COLLECTION: 310,
    EMPTY_COLLECTION: 320,
    IDLE: 400,
  }
  
  // Constructor will extract and validate Data into the attributes below
	constructor(path) {

    if (SerializerBase.instance === null) {
      this.meta = {
        parts: [],
        state: {},
      };
      SerializerBase.instance = this;
    }
    let { instance } = SerializerBase;
    instance.valid = true;
    const nextMeta = instance.extractPath(path);
    if (!instance.is_valid()) {
      instance.decision = SerializerBase.decision.IDLE;
      return instance;
    }

    const { meta: prevMeta } = instance;
    const identicalPartsCount = instance.countSamePartsAtBeginning(prevMeta.parts, nextMeta.parts);
    const decision = instance.decide(identicalPartsCount, prevMeta.parts.length, nextMeta.parts.length);
    instance.identicalPartsCount = identicalPartsCount;
    instance.decision = decision;
    instance.nextMeta = nextMeta;
    return instance;
  }

  fetchData = (setState) => {
    if (!this.is_valid()){
      throw this.error;
    }

    this.execute(this.decision, this.nextMeta, this.identicalPartsCount, setState);
  }

  collectionName = (raw) => {
    const name = raw.charAt(0).toUpperCase() + raw.substring(1,raw.length-1);
    return !models[name] ? new SerializerError(
      SerializerError.MODEL_NOT_FOUND,
      `Cannot find model "${name}."`) : name;
  }

	extractPath = (path) => {
    let instance = this;
    path = path.replace("/admin/knowledgebase","").replace(/^\/|\/$/g, '');
		let pathTokens = path.split("/");
		if (pathTokens[0] === "") {
      return {
        parts: []
      };
    }
    
    let breadcrumbs = [];
    let redirectPath = "";
    for (let i = 0; i < pathTokens.length; i++) {
      redirectPath = redirectPath + "/" + pathTokens[i];
      const type = i % 2 === 0 ? "collection" : "detail";
      const model = type === "collection" ? instance.collectionName(pathTokens[i]) : instance.collectionName(pathTokens[i-1]);
      if (model instanceof SerializerError) {
        instance.valid = false;
        instance.error = model;
        return instance.valid;
      }
      const queryPath = "/api/solverapp/knowledgebase" + redirectPath;
      breadcrumbs.push({
        model,
        type,
        queryPath,
        redirectPath: "/admin/knowledgebase" + redirectPath
      })
    }

    return {
      parts: breadcrumbs
    };
  }

  is_valid = () => {
    return this.valid;
  }

  countSamePartsAtBeginning = (pA, pB) => {
    let length = pA.length < pB.length ? pA.length : pB.length;
    for (let i = 0; i < length; i++) {
      if (pA[i].redirectPath !== pB[i].redirectPath)
        return i;
    }
    return length;
  }

  decide = (identicalPartsCount, prevLength, nextLength) => {
    if (nextLength === 1)
      return [
        SerializerBase.decision.EMPTY_DETAIL,
        SerializerBase.decision.NAVIGATE_COLLECTION
      ]
    if (identicalPartsCount === prevLength && nextLength === prevLength + 1) {
      if (nextLength % 2 === 0)
        return [SerializerBase.decision.NAVIGATE_DETAIL];
      else
        return [SerializerBase.decision.NAVIGATE_COLLECTION];
    }

    if (identicalPartsCount === nextLength && nextLength === prevLength - 1) {
      if (nextLength % 2 === 0)
        return [SerializerBase.decision.NAVIGATE_COLLECTION];
      else
        return [SerializerBase.decision.NAVIGATE_DETAIL];
    }

    if (identicalPartsCount === nextLength-1 && nextLength === prevLength) {
      if (nextLength % 2 === 0)
        return [SerializerBase.decision.SWITCH_DETAIL];
      else
        return [SerializerBase.decision.SWITCH_COLLECTION];
    }

    return [SerializerBase.decision.RESET_VIEWS];
  }

  collection = (nextMeta) => new Promise((resolve, reject) => {
    const { parts } = nextMeta;
    let processingPart;
    if (parts.length === 1)
      processingPart = parts[0];
    else {
      processingPart = parts[parts.length-1].type === "collection" ? parts[parts.length-1] : parts[parts.length-2];
    }

    const {
      model: modelName,
      queryPath,
    } = processingPart;

    axios.get(queryPath)
    .then(collectionResults => {
      const attributes = models[modelName].filter(attribute => !attribute.hiddenInTable);
      const collectionData = collectionResults.data.reduce((obj, item) => {
        obj[item._id] = attributes.map(attribute => (item[attribute.key]));
        return obj;
      }, {});
      // prevent setting state if component is unmounted
      // const collectionHeader = attributes.map(attribute => ({
      //   label: attribute.label
      // }));
      const collectionHeader = attributes.map(attribute => attribute.label);
      const collectionTitle = modelName+'s';
      const collectionDescription = `List of ${modelName}s of the knowledgebase`;
      const resolvedData = {
        collectionData,
        collectionHeader,
        collectionTitle,
        collectionDescription,
        selectedCollection: modelName.toLowerCase() + "s"
      };
      this.meta.state = Object.assign(this.meta.state, resolvedData);
      resolve(resolvedData);
    }).catch(error => {
      reject(error);
    });
  })

  detail = (nextMeta) => new Promise((resolve, reject) => {
    const { parts } = nextMeta;
    if (parts.length === 1) {
      return reject(new SerializerError(
        SerializerError.NO_DETAIL_IN_PATH,
        `The path does not request any detail object. A detail object is one of ["Concept", "Attribute", "Equation"]. Usually, this is an internal error.`
      ));
    }
    let processingPart;
    processingPart = parts[parts.length-1].type === "detail" ? parts[parts.length-1] : parts[parts.length-2];

    const {
      model: modelName,
      queryPath,
    } = processingPart;
    axios.get(queryPath)
    .then(detailResult => {
      const editableFields = models[modelName].filter(attribute => !attribute.isCollection)
        .map(attribute => {
          attribute.default = detailResult.data[attribute.key];
          return attribute;
        });
      const collectionFields = models[modelName].filter(attribute => attribute.isCollection);
      const detailTitle = detailResult.data[models[modelName].find(attribute => attribute.isDetailTitle).key];
      const resolvedData = {
        detailPath: processingPart.redirectPath,
        detailFields: editableFields,
        detailCollections: collectionFields,
        detailTitle: detailTitle === '' ? detailResult.data._id : detailTitle,
        detailDescription: modelName,
        selectedRow: detailResult.data._id,
      };
      this.meta.state = Object.assign(this.meta.state, resolvedData);
      resolve(resolvedData);
    }).catch(error => {
      reject(error);
    });
  })

  breadcrumbs = (prevMeta, nextMeta, identicalPartsCount, optionalLastLabel) => new Promise((resolve, reject) => {
    let prevParts = prevMeta.parts.slice(0, identicalPartsCount);
    
    let nextParts = nextMeta.parts.slice(identicalPartsCount);
    nextParts = nextParts.map(part => new Promise((resolve, reject) => {
      if (part.type === "detail") {
        const { queryPath, model } = part;
        axios.get(queryPath)
        .then(detailResult => {
          const label = detailResult.data[models[model].find(attribute => attribute.isDetailTitle).key];
          resolve({
            label: label === '' ? detailResult.data._id : label,
            ...part
          });
        }).catch(err => {
          reject(err);
        })
      }
      else {
        resolve({
          label: part.model + "s",
          ...part
        })
      }
    }));
    
    Promise.all(prevParts.concat(nextParts))
    .then(parts => {
      const breadcrumbs = parts.map((part, index) => {
        const collectionMeta = (part.type === "collection" && index > 0) && models[parts[index-1].model].find(attribute => attribute.key === part.model.toLowerCase()+"s");
        return {
          path: part.redirectPath,
          icon: collectionMeta ? collectionMeta.icon : null,
          label: part.label,
        }
      });
      parts = parts.map((part, index) => {
        part.icon = breadcrumbs[index].icon;
        return part;
      })
      resolve({
        parts,
        breadcrumbs
      })
    }).catch(error => {
      reject(error);
    });
  })

  // Functions used by Front-end Controller
  execute = (decisions, nextMeta, identicalPartsCount, setState) => {
    try {
      decisions.map(decision => {
        if (decision === SerializerBase.decision.EMPTY_DETAIL) {
          setState({
            detailFields: [],
            detailCollections: [],
          })
        }
        if (decision === SerializerBase.decision.NAVIGATE_COLLECTION || decision === SerializerBase.decision.SWITCH_COLLECTION
          || decision === SerializerBase.decision.RESET_VIEWS) {
          this.collection(nextMeta)
          .then(collectionResult => {
            // Should also update breadcrumbs when NAVIGATE_COLLECTION
            setState && setState(collectionResult);
          }).catch(error => {
            throw error;
          });
        }
        if (decision === SerializerBase.decision.NAVIGATE_DETAIL || decision === SerializerBase.decision.SWITCH_DETAIL
          || decision === SerializerBase.decision.RESET_VIEWS) {
          this.detail(nextMeta)
          .then(detailResult => {
            // Should also update breadcrumbs when NAVIGATE_DETAIL
            setState && setState(detailResult);
          }).catch(error => {
            throw error;
          });
        }
      })
      this.breadcrumbs(this.meta, nextMeta, identicalPartsCount).then(results => {
        const { parts, breadcrumbs } = results;
        this.meta.parts = parts;
        setState && setState({breadcrumbs});
      })
     } catch(error) {
       console.log(error);
     }
  }

  currentCollectionPath = () => {
    return this.meta.parts[this.meta.parts.length-1].type === "collection" ?
      this.meta.parts[this.meta.parts.length-1].redirectPath :
      this.meta.parts[this.meta.parts.length-2].redirectPath;
  }

  currentDetailPath = () => {
    return this.meta.parts[this.meta.parts.length-1].type === "detail" ?
      this.meta.parts[this.meta.parts.length-1].redirectPath :
      this.meta.parts[this.meta.parts.length-2].redirectPath;
  }

  updateDetail = (fieldData) => new Promise((resolve, reject) => {
    const detailIndex = this.meta.parts[this.meta.parts.length-1].type === "detail" ? 
      (this.meta.parts.length-1) : (this.meta.parts.length-2);
    const queryPath = this.meta.parts[detailIndex].queryPath;
    const modelName = this.meta.parts[detailIndex].model;
    let dataToUpdate = {};
    fieldData.map(field => {
      dataToUpdate[field.key] = field.default;
      return field;
    });
    axios.patch(queryPath, dataToUpdate)
    .then(detailResult => {
      const label = detailResult.data[models[modelName].find(attribute => attribute.isDetailTitle).key];
      this.meta.parts[detailIndex].label = label === '' ? detailResult.data._id : label;
      const detailFields = models[modelName].filter(attribute => !attribute.isCollection)
        .map(attribute => {
          attribute.default = detailResult.data[attribute.key];
          return attribute;
        });
      const detailTitle =  detailResult.data[models[modelName].find(attribute => attribute.isDetailTitle).key];
      let { collectionData } = this.meta.state;
      if (this.meta.state.selectedRow !== null && detailIndex === this.meta.parts.length - 1) {
        collectionData[this.meta.state.selectedRow] = detailFields.map(attribute => attribute.default);
      }
      const resolvedData = {
        collectionData,
        detailFields,
        detailTitle: detailTitle === '' ? detailResult.data._id : detailTitle,
        breadcrumbs: this.meta.parts
      };
      this.meta.state = Object.assign(this.meta.state, resolvedData);
      resolve(resolvedData)
    }).catch(error => {
      reject(error);
    })
  })

  deleteFromCollection = (id) => new Promise((resolve, reject) => {
    const collectionIndex = this.meta.parts[this.meta.parts.length-1].type === "collection" ? 
    (this.meta.parts.length-1) : (this.meta.parts.length-2);
    const queryPath = this.meta.parts[collectionIndex].queryPath;
    const redirectPath = this.meta.parts[collectionIndex].redirectPath;
    axios.delete(queryPath+"/"+id)
    .then(() => {
      let { collectionData, selectedRow } = this.meta.state;
      delete collectionData[id];
      if (selectedRow === id) {
        if (Object.keys(collectionData).length > 0)
          resolve({
            status: "success",
            redirectPath: redirectPath + "/" + Object.keys(collectionData)[0]
          });
        else
          resolve({
            status: "success",
            redirectPath
          });
      } else {
        resolve({
          status: "success",
          stateData: {
            collectionData
          }
        });
      }
    }).catch(err => reject(err));
  })

  dialogPropsForCollection = () => {
    const collectionIndex = this.meta.parts[this.meta.parts.length-1].type === "collection" ? 
      (this.meta.parts.length-1) : (this.meta.parts.length-2);
    return {
      formDialogTitle: "Create New " + this.meta.parts[collectionIndex].model,
      formDialogDescription: "Add a new " + this.meta.parts[collectionIndex].model + " to the Knowledgebase",
      formDialogFields: models[this.meta.parts[collectionIndex].model].filter(att => !att.isCollection)
    }
  }

  createItemFromCollection = (fieldValues) => new Promise((resolve, reject) => {
    const collectionIndex = this.meta.parts[this.meta.parts.length-1].type === "collection" ? 
      (this.meta.parts.length-1) : (this.meta.parts.length-2);
    const queryPath = this.meta.parts[collectionIndex].queryPath;
    const redirectPath = this.meta.parts[collectionIndex].redirectPath;
    const modelName = this.meta.parts[collectionIndex].model;
    axios.post(queryPath, fieldValues)
    .then(response => {
      let { collectionData } = this.meta.state;
      let selectedRow;
      if (response.data instanceof Array) {
        selectedRow = response.data.map(newItem => {
          const { _id, ...rest } = newItem;
          collectionData[_id] = models[modelName].filter(att => !att.hiddenInTable).map(att => rest[att.key]);
          return _id;
        })[0];
      }
      else {
        const { _id, ...rest } = response.data;
        collectionData[_id] = models[modelName].filter(att => !att.hiddenInTable).map(att => rest[att.key]);
        selectedRow = _id;
      }
      resolve({
        status: "success",
        redirectPath: redirectPath + "/" + selectedRow,
        stateData: {
          collectionData,
          selectedRow
        }
      });
    }).catch(error => reject(error));
  })
}

const Serializer = (path) => {
  return new SerializerBase(path);
}

export default Serializer;