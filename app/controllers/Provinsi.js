var express         = require('express'),
    app             = express(),
    router          = express.Router(),
    mongoose        = require('mongoose');
var admin            = mongoose.model('Admin');
var tokenAdmin       = mongoose.model('TokenAdmin');
var Prov            = mongoose.model('Provinsi');
var jwt             = require('jsonwebtoken');
var moment          = require('moment');


module.exports = function (app) {
    app.use('/v1/provinsi/', router);
};

router.post('/add',function(req,res,next){
    let header = req.header('Authorization');
    let data   = tokenAdmin.remove({Token:header});
    data.exec(function(err,result){
        if(result != null){
            jwt.verify(header,'Login',function(err,data){
                if(err){
                    res.json({
                        hasil : false,
                        Message : "Login dulu"
                    })
                }else{
                    var data2 = admin.findOne({Username:data.username});
                    data2.exec(function(err,result2){
                        if(result2 != null){
                            var data3 = Prov.findOne({$or:[{Nama:req.body.nama},{kode:req.body.kode}]})
                            data3.exec(function(err,result3){
                                if(result3 == null){
                                    var input = new Prov({
                                        Nama    : req.body.nama,
                                        Kode    : req.body.kode,
                                        Status  : 1,
                                        CreatedAt: moment(moment(new Date()), 'MM/DD/YYYY')
                                    })
                                input.save(function(err,result){
                                    res.json({
                                        hasil   : true,
                                        Message : "Berhasil"
                                    })
                                })
                                }else{
                                    res.json({
                                        hasil : false,
                                        Message : "Nama Provinsi/ Kode sudah ada"
                                    })
                                }
                            })
                        }else {
                            res.json({
                                hasil : false,
                                Message : "Admin Tidak ad"
                            })
                        }
                    })
                }
            })
        }else{
            res.json({
                hasil : false,
                Message : "Login dulu"
            })
        }
    })
})