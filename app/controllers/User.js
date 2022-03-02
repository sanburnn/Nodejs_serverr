var express         = require('express'),
    app             = express(),
    router          = express.Router(),
    mongoose        = require('mongoose');
var user            = mongoose.model('User');
var moment          = require('moment');
const bcrypt        = require('bcrypt');
var jwt             = require('jsonwebtoken');
const saltRounds    = 10;

module.exports = function (app) {
    app.use('/v1/user/', router);
};

router.post('/register',function(req,res,next){
    var data    =   user.findOne({Username:req.body.username})
    data.exec(function(err,result){
        if(result == null){
            bcrypt.hash(req.body.password, saltRounds, function(err,hash){
        var input = new user({
            Username    : req.body.username,
            Password    : hash,
            Fullname    : req.body.fullname,
            Kota        : req.body.kota,
            Kecamatan   : req.body.kecamatan,
            Alamat      : req.body.alamat,
            Jurusan     : req.body.jurusan,
            Nim         : req.body.nim,
            Prodi       : req.body.prodi,
            CreatedAt   : moment(moment(new Date()), 'MM/DD/YYYY').format()
        });
        input.save(function(err,result){
            res.json({
                hasil   : true,
                message : "Berhasil"
            })
        })
    })
        } else {
            res.json({
                hasil   : false,
                message : "Username sudah ada"
            })
        }  
    })    

    
})
router.post('/login',function(req,res,next){
    var data = user.findOne({Username:req.body.username});
            data.exec(function(err,result){
                if(result != null){
                    bcrypt.compare(req.body.password, result.Password, function(err,compare){
                        if(compare == true){
                            var token = jwt.sign({
                                username    : result.Username
                            }, 'Login');
                            res.json({
                                hasil    : true,
                                message  : "Berhasil",
                                token    : token
                            })
                        }else {
                            res.json({
                                hasil    : false,
                                message  : "password Salah",
                                token    : ""
                            })
                        }
                    })
                }else{
                 res.json({
                     hasil    : false,
                     message  : "Username tdak ada",
                     token    : ""
                 })
                }
            })
     })
router.post('/editpassword',function(req,res,next){
    var data = user.findOne({Username:req.body.username});
    data.exec(function(err,result){
        if(result != null){
            bcrypt.compare(req.body.passwordLama, result.Password,function(err,compare){
            if(compare == true){
             bcrypt.hash(req.body.passwordBaru, saltRounds,function(err,hash){
                var dataOld = { _id     : result._id};
                var datanew = { Password : hash};
                var options = {};
                user.update(dataOld, datanew, options, callback);
                function callback(err,result){
                    res.json({
                        hasil   : true,
                        message : "berhasil"
                    })
                }
            })
        }else{
            res.json({
                hasil :false,
                message : "Password lama salah"
            })
        }
    })
        }else{
            res.json({
                hasil : false,
                message : "user salah"
            })
        }
    })
})

router.post('/listkota', function(req,res,next){
    var data = user.find({Kota: req.body.kota});
    data.exec(function(err,result){
    res.json({
        hasil  : true,
        result : result
    })
    })
})

router.post('/listkecamatan', function(req,res,next){
    var data = user.find({$and:[{Kota:req.body.kota},{Kecamatan:req.body.kecamatan}]});
    data.exec(function(err,result){
    res.json({
        hasil  : true,
        result : result
    })
    })
})

router.post('/listkecamatanor', function(req,res,next){
    var data = user.find({$or:[{Kota:req.body.kota},{Kecamatan:req.body.kecamatan}]});
    data.exec(function(err,result){
    res.json({
        hasil  : true,
        result : result
    })
    })
})
