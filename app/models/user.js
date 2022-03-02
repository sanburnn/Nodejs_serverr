var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var UserSchema = new Schema({ 
    Username    : {
        type    : String
    },
    Password    : {
        type    : String
    },
    Fullname    : {
        type    : String
    },
    Kota        : {
        type    : String
    },
    Kecamatan   : {
        type    : String
    },
    Alamat      : {
        type    : String
    },
    Jurusan     : {
        type    : String
    },
    Nim         : {
        type    : String
    },
    Prodi       : {
        type    : String
    },
    CreatedAt       : {
        type    : String
    }
})
mongoose.model('User', UserSchema);
