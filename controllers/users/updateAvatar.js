const path = require('path');
const jimp = require("jimp");

const { User } = require('../../models/user');

const avatarsDir = path.join(__dirname, '../', '../', 'public', 'avatars');

const updateAvatar = async(req, res) => {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;
    const filename = `${_id}_${originalname}`
    const resultUpload = path.join(avatarsDir, filename);

    await jimp
    .read(tempUpload)
    .then((image) => {
      image.resize(250, 250).write(`${resultUpload}`);
    })
    .catch((error) => {
      console.log(error.message);
    });

    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, {avatarURL})

    res.json({
        avatarURL,
    })
}

module.exports = updateAvatar;