const times = ({ deep, print }) => {
  const timesArray = [];
  for (let i = 0; i <= deep; i++) {
    timesArray.push(print);
  }
  return timesArray.join("");
};

const DIRECTORY = (data) => (children) => (callback) => callback(data)(children);
const GET_CHILDREN_COMMAND = () => (children) => children;
const GET_FORMATTED_DATA_COMMAND = (deep) => (data) => () =>
  `\n${times({ deep, print: "  " })} ${data}`;
const GET_DATA_COMMAND = (data) => () => data;

const createPathDirectory = ({ rootDirectory, path = [] }) => {
  const directoryToCreate = path.shift();

  let currentDirectory = findDirectory({
    rootDirectory,
    pathToSearch: [directoryToCreate],
  });
  if (!currentDirectory) {
    currentDirectory = DIRECTORY(directoryToCreate)(new Set());
    createDirectory({ rootDirectory, newDirectory: currentDirectory });
  }

  if (path.length > 0) {
    createPathDirectory({ rootDirectory: currentDirectory, path });
  }
};

const createDirectory = ({ rootDirectory, newDirectory }) =>
  rootDirectory(GET_CHILDREN_COMMAND).add(newDirectory);

const findDirectory = ({ rootDirectory, pathToSearch = [] }) => {
  const directoryToFind = pathToSearch.shift();
  if (rootDirectory(GET_DATA_COMMAND) === directoryToFind) {
    return rootDirectory;
  }

  for (let child of rootDirectory(GET_CHILDREN_COMMAND)) {
    if (child(GET_DATA_COMMAND) === directoryToFind && pathToSearch.length == 0) {
      return child;
    }
    if (child(GET_DATA_COMMAND) === directoryToFind && pathToSearch.length != 0) {
      return findDirectory({ rootDirectory: child, pathToSearch });
    }
  }
  return null;
};

const printDirectory = ({ rootDirectory, result = "", deep = 0 }) => {
  result = result.concat(rootDirectory(GET_FORMATTED_DATA_COMMAND(deep)));
  for (let child of rootDirectory(GET_CHILDREN_COMMAND)) {
    result = printDirectory({ rootDirectory: child, result, deep: deep + 1 });
  }
  return result;
};

const head = DIRECTORY("root")(new Set());

module.exports = {
  create: ({ dir = "" }) => {
    createPathDirectory({ rootDirectory: head, path: dir.split("/") });
    return `CREATE ${dir}`;
  },
  list: () => `LIST ${printDirectory({ rootDirectory: head })}`,
  move: ({ source, target }) => {
    const sourceDir = source.split("/");
    const targetDir = target.split("/");
    const parentDir = sourceDir.slice(0, sourceDir.length - 1);

    const sourceDirectoryParent = findDirectory({
      rootDirectory: head,
      pathToSearch: parentDir.length > 0 ? parentDir : ["root"],
    });
    const sourceDirectory = findDirectory({
      rootDirectory: head,
      pathToSearch: sourceDir,
    });
    const targetDirectory = findDirectory({ rootDirectory: head, pathToSearch: targetDir });

    targetDirectory(GET_CHILDREN_COMMAND).add(sourceDirectory);
    sourceDirectoryParent(GET_CHILDREN_COMMAND).delete(sourceDirectory);

    return `MOVE ${source} ${target}`;
  },
  delete: ({ dir }) => {
    const dirToDelete = dir.split("/");
    const parentDir = dirToDelete.slice(0, dirToDelete.length - 1);

    const parentDirectory = findDirectory({
      rootDirectory: head,
      pathToSearch: parentDir.length > 0 ? parentDir : ["root"],
    });
    const directoryToDelete = findDirectory({
      rootDirectory: head,
      pathToSearch: dirToDelete,
    });

    parentDirectory(GET_CHILDREN_COMMAND).delete(directoryToDelete);
    return `DELETE ${dir}`;
  },
};
