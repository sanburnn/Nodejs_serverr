var express         = require('express'),
    app             = express(),
    router          = express.Router(),
    mongoose        = require('mongoose');
var tokenAdmin      = mongoose.model('TokenAdmin');
var admin           = mongoose.model('Admin');
var prov            = mongoose.model('Provinsi');
var kota            = mongoose.model('Kota');
var moment          = require('moment');
var jwt             = require('jsonwebtoken');


module.exports = function (app) {
     app.use('/v1/kota/', router);
 };

 router.post('/add', function(req,res,next){
    let header  = req.header('Authorization');
    let data    = tokenAdmin.findOne({Token:header});

    data.exec(function(err,result){
        if (result != null) {
            jwt.verify(header, 'Login', function(err, data){
                if (err) {
                    res.json({
                        Hasil : false,
                        Message : "Login Dulu !"
                    })
                } else{
                    var data2 = admin.findOne({Username : data.username});
                    data2.exec(function(err,result2){
                        if(result2 != null){
                            if (result2.Level == 1){
                                var data3 = prov.findOne({Kode : req.body.provinsi});
                                data3.exec(function(err,result3){
                                    if (result3 != null) {
                                        var data4 = kota.findOne({$or : [{Kode : req.body.kode},{$and : [{Nama : req.body.nama}, {Provinsi : result3._id}]}]});
                                        data4.exec(function(err,result4){
                                            if (result4 == null) {
                                                var input = new kota ({
                                                            Nama   : req.body.nama,
                                                            Kode   : req.body.kode,
                                                            Status : 1,
                                                            Provinsi : result3._id,
                                                            CreatedAt : moment(moment(new Date()), 'MM/DD/YYYY').format()
    
                                                })
                                                input.save(function(err,result){
                                                    res.json({
                                                        Hasil   : true,
                                                        Message : " Berhasil Tambah Kota"
                                                    })
                                                })
                                            } else{
                                                res.json({
                                                    Hasil   : false,
                                                    Message : " Gagal Tambah Kota/ Kota Sudah Tersedia"
                                                })
                                            }
                                        })
                                    }else{
                                        res.json({
                                            Hasil : false,
                                            Message : "Provinsi tidak ada",
                                        })
                                    }
                                })
                            } else {
                                res.json({
                                    hasil   :   false,
                                    Message :   "Tidak punya akses"
                                })
                            }
                            }else{
                                res.json({
                                    Hasil    : false,
                                    Message  : " Admin tidak ada "
                            })
                        }
                    })
                }
            })
        }else {
            res.json({
                Hasil      : false,
                Message    : "Anda Harus Login"
            })
          }
    })
 
 })

 router.post('/listkotabyProv', function(req,res,next){
     var data   = prov.findOne({Kode : req.body.provinsi});
     data.exec(function(err,result){
         if (result != null) {
            var data2   = kota.find({Provinsi : result._id});
            data2.exec(function(err,result2){
            res.json({
                Hasil : true,
                result : result2
            })
         })
         } else {
             res.json({
                 Hasil : false,
                 Message : "Data tidak ditemukan"
             })
         }
     })
 })