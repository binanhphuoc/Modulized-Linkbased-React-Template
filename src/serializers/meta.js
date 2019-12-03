const meta = {
  model: ['',''],
  paths: ['',''],
  detailIndex: 0,
  collectionIndex: 0,
}

const retrieveMetaFromPath = () => {
  let model = ['',''];
  let pathsToCall = ['',''];

  // Retrieve links to call DB from path
  let path = window.location.pathname.replace("/admin/knowledgebase","").replace(/^\/|\/$/g, '');
  let pathTokens = path.split("/");
  if (pathTokens[0] === "")
    pathTokens[0] = "concepts";
  for (let i = 0; i < pathTokens.length-1; i++) {
    pathsToCall[0] = pathsToCall[0] + "/" + pathTokens[i];
  }
  pathsToCall[1] = pathsToCall[0] + "/" + pathTokens[pathTokens.length-1];
  let detailIndex, collectionIndex;
  if (pathTokens.length % 2 === 0) {
    model[0] = pathTokens[pathTokens.length - 2];
    model[1] = model[0];
    collectionIndex = 0;
    detailIndex = 1;
  }
  else {
    model[0] = pathTokens.length >= 3 ? pathTokens[pathTokens.length - 3] : '';
    model[1] = pathTokens[pathTokens.length - 1];
    collectionIndex = 1;
    detailIndex = 0;
  }
  model[0] = model[0].charAt(0).toUpperCase() + model[0].substring(1,model[0].length-1);
  model[1] = model[1].charAt(0).toUpperCase() + model[1].substring(1,model[1].length-1);
  
  meta.model = model;
  meta.paths = pathsToCall;
  meta.collectionIndex = collectionIndex;
  meta.detailIndex = detailIndex;
}

const sendMeta = () => {
  retrieveMetaFromPath();
  return meta;
}

export default sendMeta;