var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var KecamatanSchema = new Schema({ 
    Nama        : {
        type    : String
    },
    Kode        : {
        type    : String
    },
    Status      : {
        type    : Number
    },
    Provinsi    : {
        type    : Schema.Types.ObjectId,
        ref     : 'Provinsi'
    },
    Kota        : {
        type    : Schema.Types.ObjectId,
        ref     : 'Kota'
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
    EditedBy   : {
        type    : Schema.Types.ObjectId,
        ref     : 'Admin'
    }
})
mongoose.model('Kecamatan', KecamatanSchema);