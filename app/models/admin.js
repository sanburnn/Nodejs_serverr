var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var AdminSchema = new Schema({ 
    Username    : {
        type    : String
    },
    Fullname    : {
        type    : String
    },
    Password    : {
        type    : String
    },
    Email       : {
        type    : String
    },
    NomorTelepon : {
        type    : String
    },
    Foto        : {
        type    : String
    },
    Level       : {
        type    : Number
        // 1 untuk super admin
        // 2 untuk admin desa
    },
    Provinsi    : {
        type    : Schema.Types.ObjectId,
        ref     : 'Provinsi'
    },
    Kota        : {
        type    : Schema.Types.ObjectId,
        ref     : 'Kota'
    },
    Kecamatan   : {
        type    : Schema.Types.ObjectId,
        ref     : 'Kecamatan'
    },
    Desa        : {
        type    : Schema.Types.ObjectId,
        ref     : 'Desa'
    },
    BankSampah  : {
        type    : Schema.Types.ObjectId,
        ref     : 'BankSampah'
    },
    CreatedAt   : {
        type    : String
    },
    CreatedBy   : {
        type    : Schema.Types.ObjectId,
        ref     : 'Admin'
    },
    EditedAt    : {
        type    : String
    },
    EditedAt    : {
        type    : Schema.Types.ObjectId,
        ref     : 'Admin'
    }
    
})
mongoose.model('Admin', AdminSchema);
