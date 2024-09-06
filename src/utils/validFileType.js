const validFileExtensions = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp"],
  video: ["mp4"],
};

export const isValidFileType = (fileName, fileType) => {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
};
