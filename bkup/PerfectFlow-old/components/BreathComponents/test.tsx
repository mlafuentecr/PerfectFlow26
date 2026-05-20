const logInfo = ({e}: any, {sound}: any) => {
  if (e) {
    console.log('Error in SOUND', e);
    return;
  }
  console.log(
    `duration in seconds: ${sound.getDuration()} number of channels: ${sound.getNumberOfChannels()}`,
  );
};
export {logInfo};
