var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var KotaSchema = new Schema({ 
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
mongoose.model('Kota', KotaSchema);