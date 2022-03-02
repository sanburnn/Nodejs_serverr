var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var ProvinsiSchema = new Schema({ 
    Nama        : {
        type    : String
    },
    Kode        : {
        type    : String
    },
    Status      : {
        type    : Number
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
mongoose.model('Provinsi', ProvinsiSchema);
