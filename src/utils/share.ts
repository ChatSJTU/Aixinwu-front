import copy from 'copy-to-clipboard';

export const shareContent = async (
  title: string,
  text: string,
  url: string,
  failedWithCopy: boolean = true,
  onlyCopyUrl: boolean = true
) => {

  if (typeof navigator.share !== "undefined") {   
    // browser support navigator.share
    try {
      await navigator.share({
        title: title,
        text: text,
        url: url,
      });
      return;
    } catch (error) { throw error; }
  }

  const shareText = onlyCopyUrl ? url : `【${title}】\n${text}\n${url}`;
  if (failedWithCopy) copy(shareText);
};

