import axios from 'axios';

import models from "../models";

class SerializerError {
  
  static MODEL_NOT_FOUND = "model_not_found";

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
    NAVIGATE_COLLECTION: 300,
    SWITCH_COLLECTION: 310,
  }
  
  // Constructor will extract and validate Data into the attributes below
	constructor(path) {

    if (SerializerBase.instance === null) {
      this.meta = {
        parts: []
      };
      SerializerBase.instance = this;
    }
    let { instance } = SerializerBase;
    instance.valid = true;
    const nextMeta = instance.extractPath(path);
    if (!instance.is_valid()) {
      return instance;
    }
    
    const { meta: prevMeta } = instance;
    const identicalPartsCount = instance.countSamePartsAtBeginning(prevMeta.parts, nextMeta.parts);

    const decision = instance.decide(identicalPartsCount, prevMeta.parts.length, nextMeta.parts.length);
    instance.execute(decision, nextMeta);
    return instance;
  }

  collectionName = (raw) => {
    const name = raw.charAt(0).toUpperCase() + raw.substring(1,raw.length-1);
    return !models[name] ? new SerializerError(
      SerializerError.MODEL_NOT_FOUND,
      `Cannot find model "${name}."`) : name;
  }

	extractPath = (path) => {
    let { instance } = SerializerBase;
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
    return SerializerBase.instance.valid;
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
    console.log(`${identicalPartsCount} ${prevLength} ${nextLength}`);
    if (identicalPartsCount === prevLength && nextLength === prevLength + 1) {
      if (nextLength % 2 === 0)
        return SerializerBase.decision.NAVIGATE_DETAIL;
      else
        return SerializerBase.decision.NAVIGATE_COLLECTION;
    }

    if (identicalPartsCount === nextLength && nextLength === prevLength - 1) {
      if (nextLength % 2 === 0)
        return SerializerBase.decision.NAVIGATE_COLLECTION;
      else
        return SerializerBase.decision.NAVIGATE_DETAIL;
    }

    if (identicalPartsCount === nextLength-1 && nextLength === prevLength) {
      if (nextLength % 2 === 0)
        return SerializerBase.decision.SWITCH_DETAIL;
      else
        return SerializerBase.decision.SWITCH_COLLECTION;
    }

    return SerializerBase.decision.RESET_VIEWS;
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
      const collectionHeader = attributes.map(attribute => ({
        label: attribute.label
      }));
      const collectionTitle = modelName+'s';
      const collectionDescription = `List of ${modelName}s of the knowledgebase`;
      resolve({
        collectionData,
        collectionHeader,
        collectionTitle,
        collectionDescription
      });
    }).catch(error => {
      reject(error);
    });
  })

  detail = (nextMeta) => new Promise((resolve, reject) => {
    const { parts } = nextMeta;
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
      resolve({
        detailFields: editableFields,
        detailCollections: collectionFields,
      });
    }).catch(error => {
      reject(error);
    });
  })

  // Consider nextMeta.parts = []
  execute = (decision, nextMeta) => {
    console.log(decision);
    console.log(nextMeta.parts);
    SerializerBase.instance.meta = nextMeta;
  }

  breadcrumbs = () => {
    const { instance } = SerializerBase;
    if (!instance.is_valid())
      return instance.is_valid();
    const { parts } = instance.meta;
    return parts.map(breadcrumbPart => ({
      path: breadcrumbPart.redirectPath,
      label: breadcrumbPart.model + "s"
    }));
  }
}

const Serializer = (path) => {
  return new SerializerBase(path);
}

export default Serializer;