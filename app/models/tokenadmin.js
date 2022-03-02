var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var TokenAdminSchema = new Schema({ 
    Username    : {
        type    : Schema.Types.ObjectId,
        ref     : 'Admin'
    },
    Token        : {
        type    : String
    },
    CreatedAt   : {
        type    : String
    }
    
})
mongoose.model('TokenAdmin', TokenAdminSchema);
