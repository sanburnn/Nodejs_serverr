var express         = require('express'),
    app             = express(),
    router          = express.Router(),
    mongoose        = require('mongoose');
var tokenAdmin      = mongoose.model('TokenAdmin');
var admin           = mongoose.model('Admin');
var prov            = mongoose.model('Provinsi');
var kota            = mongoose.model('Kota');
var kec             = mongoose.model('Kecamatan');
var desa            = mongoose.model('Desa');
var moment          = require('moment');
var jwt             = require('jsonwebtoken');


module.exports = function (app) {
     app.use('/v1/desa/', router);
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
                                               var data5 = kec.findOne({Kode : req.body.kecamatan});
                                               data5.exec(function(err,result5){
                                                   if (result5 != null){
                                                      var data6 = desa.findOne({$or : [{Kode : req.body.kode},{$and : [{Nama : req.body.nama},{Provinsi : result3._id}, {Kota : result4._id}, {Kecamatan : result5._id}]}]});
                                                      data6.exec(function(err,result6){
                                                          if (result6 == null) {
                                                                    var input = new desa({
                                                                        Nama      : req.body.nama,
                                                                        Kode      : req.body.kode,
                                                                        Provinsi  : result3._id,
                                                                        Kota      : result4._id,
                                                                        Kecamatan : result5._id,
                                                                        Status    : 1,
                                                                        CreatedAt : moment(moment(new Date()), 'MM/DD/YYYY').format()
                                                                        })
                                                                        input.save(function(err,result){
                                                                            res.json({
                                                                                Hasil : true,
                                                                                Message : "Berhasil Menambah Desa"
                                                                            })
                                                                        })
                                                          } else {
                                                              res.json({
                                                                  Hasil     : false,
                                                                  Message   : "Gagal Menambah Desa/ Desa sudah tersedia"
                                                              })
                                                          }
                                                      })
                                                   } else{
                                                       res.json({
                                                           Hasil : false,
                                                           Message : "Kecamatan tidak ditemukan"
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

 router.post('/desabyKecamatan', function(req,res,next){
    var data = prov.findOne({Kode : req.body.provinsi});
    data.exec(function(err,result){
        if (result != null) {
            var data2 = kota.findOne({Kode : req.body.kota});
            data2.exec(function(err,result2){
                if(result2 != null){
                    var data3 = kec.findOne({Kode : req.body.kecamatan});
                    data3.exec(function(err,result3){
                    if(result3 != null){
                   var data4 = desa.find({$and : [{Provinsi : result._id},{Kota : result2._id},{Kecamatan: result3._id}]});
                   data4.exec(function (err,result4) {
                       res.json({
                           Hasil : true,
                           result : result4
                       })       
                    })
                    }else {
                        res.json({
                            Hasil : false,
                            Message : "kecamatan tidak ditemukan"
                        })
                    }
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