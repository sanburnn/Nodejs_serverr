var express         = require('express'),
    app             = express(),
    router          = express.Router(),
    mongoose        = require('mongoose');
var tokenAdmin      = mongoose.model('TokenAdmin');
var admin           = mongoose.model('Admin');
var prov            = mongoose.model('Provinsi');
var kota            = mongoose.model('Kota');
var kec             = mongoose.model('Kecamatan');
var moment          = require('moment');
var jwt             = require('jsonwebtoken');


module.exports = function (app) {
     app.use('/v1/kecamatan/', router);
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
                                        var data4 = kota.findOne({Kode : req.body.kota});
                                        data4.exec(function(err,result4){
                                            if (result4 != null) {
                                               var data5 = kec.findOne({$or :[ {Kode : req.body.kode}, {$and : [{Nama : req.body.nama},{Provinsi : result3._id},{Kota : result4._id}]}]});
                                               data5.exec(function(err,result5){
                                                   if (result5 == null){
                                                       var input = new kec({
                                                                    Nama : req.body.nama,
                                                                    Kode : req.body.kode,
                                                                    Provinsi : result3._id,
                                                                    Kota : result4._id,
                                                                    Status : 1,
                                                                    CreatedAt : moment(moment(new Date()), 'MM/DD/YYYY').format()
                                                       })
                                                       input.save(function(err,result){
                                                           res.json({
                                                               Hasil : true,
                                                               Message : "Berhasil Menambah Kecamatan"
                                                           })
                                                       })
                                                   } else{
                                                       res.json({
                                                           Hasil : false,
                                                           Message : "Gagal Menambah Kecamatan"
                                                       })
                                                   }
                                               })
                                            } else{
                                                res.json({
                                                    Hasil   : false,
                                                    Message : " Kota Tidak Ada"
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

 router.post('/kecbyKota', function(req,res,next){
     var data = prov.findOne({Kode : req.body.provinsi});
     data.exec(function(err,result){
         if (result != null) {
             var data2 = kota.findOne({Kode : req.body.kota});
             data2.exec(function(err,result2){
                 if(result2 != null){
                    var data3 = kec.find({$and : [{Provinsi : result._id},{Kota : result2._id}]});
                    data3.exec(function (err,result3) {
                        res.json({
                            Hasil : true,
                            result3 : result3
                        })
                        
                    })
                 } else {
                    res.json({
                        Hasil : false,
                        Message : "Kota tidak ditemukan"
                    })
                 }
             })
             
         } else{
            res.json({
                Hasil : false,
                Message : "Provinsi tidak ditemukan"
            })
         }
     })
 })