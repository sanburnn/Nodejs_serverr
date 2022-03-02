var express         = require('express'),
    app             = express(),
    router          = express.Router(),
    mongoose        = require('mongoose');
var tokenAdmin      = mongoose.model('TokenAdmin');
var admin           = mongoose.model('Admin');
var desa            = mongoose.model('Desa');
var BankSampah      = mongoose.model('BankSampah');
var moment          = require('moment');
var jwt             = require('jsonwebtoken');
var randomstring    = require("randomstring");  

    module.exports = function (app) {
        app.use('/v1/banksampah/', router);
    };
    
router.post('/add', function(req,res,next){
    let header  = req.header('Authorization');
    let data    = tokenAdmin.remove({Token:header});

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
                                var data3 = desa.findOne({Kode : req.body.desa});
                                data3.exec(function(err,result3){
                                    if (result3 != null) {
                                        cariKode(function(random){
                                            var data4 = BankSampah.findOne({NomorTelepon:req.body.nomortelepon});
                                            data4.exec(function(err,result4){
                                                if(result4 == null){
                                                    var input = new BankSampah({
                                                        Nama :req.body.nama,
                                                        NomorTelepon: req.body.nomortelepon,
                                                        Ketua : req.body.Ketua,
                                                        Status: 1,
                                                        Kode : random,
                                                        Provinsi: result3.Provinsi,
                                                        Kota : result3.Kota,
                                                        Kecamatan : result3.Kecamatan,
                                                        Desa: result3._id,
                                                        CreatedAt: moment(moment(new Date()),'MM/DD/YYYY').format(),
                                                        CreatedBy: result2._id
                                                    })
                                                    input.save(function(err,result){
                                                        res.json({
                                                            hasil: true,
                                                            message: "Berasill"
                                                        })
                                                    })
                                                }else{
                                                    res.json({
                                                        hasil:false,
                                                        message:"Nomor Telpon Sudah digunakan"
                                                    })
                                                }
                                            })
                                        })
                                    }else{
                                        res.json({
                                            hasil : false,
                                            message:"Desa tidak ada"
                                        })
                                    }
                                })
                            }else{
                                res.json({
                                    hasil: false,
                                    message: "Tidak punya akses"
                                })
                            }
                        }else{
                            res.json({
                                hasil:false,
                                message:"Admin tidak ada"
                            })
                        }
                
                    })
                }
            })
        }else{
            res.json({
                hasil:false,
                message:"Login dulu"
            })
        }
    })
})
 function cariKode(callback){
     let random = randomstring.generate({
         length:7,
         charset:'alphabetic'
     })
     let stop = true;
     while(stop == false){
         var data2 = BankSampah.findOne({kode:random});
         data2.exec(function(err,result){
             if(result == null){
                 stop = true
             }
         })
     }
     callback(random)
 }
                