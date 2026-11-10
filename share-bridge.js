import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

window.BasicXShare = async (canvas, title, filename) => {
  const data = canvas.toDataURL('image/png').split(',')[1];
  const file = await Filesystem.writeFile({
    path: filename,
    data,
    directory: Directory.Cache
  });
  await Share.share({ title, files: [file.uri] });
};
