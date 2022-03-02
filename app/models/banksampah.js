var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var BankSampahSchema = new Schema({ 
    Nama        : {
        type    : String
    },
    NomorTelepon : {
        type    : String
    },
    Kode        : {
        type    : String
    },
    Ketua        : {
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
    Kecamatan   : {
        type    : Schema.Types.ObjectId,
        ref     : 'Kecamatan'
    },
    Desa        : {
        type    : Schema.Types.ObjectId,
        ref     : 'Desa'
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
mongoose.model('BankSampah', BankSampahSchema);