var express         = require('express'),
    app             = express(),
    router          = express.Router(),
    mongoose        = require('mongoose');
var admin            = mongoose.model('Admin');
var tokenAdmin       = mongoose.model('TokenAdmin');
var banksampah      = mongoose.model('BankSampah');
var desa            = mongoose.model('Desa');
var moment          = require('moment');
const bcrypt        = require('bcrypt');
const saltRounds    = 10;
var jwt             = require('jsonwebtoken');

module.exports = function (app) {
    app.use('/v1/admin/', router);
};

router.post('/register', function(req,res,next){
    var data    = admin.findOne({$or : [{Username : req.body.username}, {Email : req.body.email}, {NomorTelepon : req.body.nomorTelepon}]});
    data.exec(function(err,result){
        if(result == null){
            var password    = req.body.password;
            var username    = req.body.username;
            var Hp          = req.body.nomorTelepon;
            let regexUser   = /[^A-Za-z0-9]+/g.test(password);
            let regexPass   = /[^A-Za-z0-9]+/g.test(username);
            let regexHp   = /[^0-9]+/g.test(Hp);

            if (regexUser == false && regexPass == false && regexHp == false && password.length > 7 && username.length > 4 ){
                bcrypt.hash (password, saltRounds, function(err, hash){
                    var input = new admin({
                                    Username    : username,
                                    Fullname    : req.body.fullname,
                                    Password    : hash,
                                    Email       : req.body.email,
                                    NomorTelepon: Hp,
                                    Foto        : "",
                                    Level       : 1,
                                    createdAt   : moment(moment(new Date()), 'MM/DD/YYYY').format()
                    })
                    input.save(function(err,result){
                        res.json({
                            Hasil   : true,
                            Message : "Berhasil"
                        })
                    })
                })
            }else {
                if(regexUser != false){
                    res.json({
                        Hasil   : false,
                        Message : "Username Mengandung Selain Huruf dan Angka"
                    })
                }else if(regexPass != false){
                    res.json({
                        Hasil   : false,
                        Message : "Password Mengandung Selain Huruf dan Angka"
                    })
                } else if(regexHp != false){
                    res.json({
                        Hasil   : false,
                        Message : "NO HP Mengandung Huruf"
                    })
                } else if (password.length < 8 ) {
                    res.json({
                        Hasil   : false,
                        Message : "Password Kurang Panjang"
                    })
                } else if (username.length < 5){
                    res.json({
                        Hasil   : false,
                        Message : "Username Kurang Panjang"
                    })
                }else {
                    res.json({
                        Hasil   : false,
                        Message : "Gagal Register"
                    })
                }
            }

        }else{
            res.json({
                Hasil   : false,
                Message :"Salah"
            })
        }
    })
})

router.post('/login', function(req,res,next){
    var data    = admin.findOne({$or : [{Username : req.body.username},{Email : req.body.username},{NomorTelepon : req.body.username}]});
    data.exec(function(err,result){
        if (result != null) {
            bcrypt.compare(req.body.password, result.Password, function(err,compare){
                if(compare == true){
                    var token = jwt.sign({username : result.Username },'Login');
                    var data2 = tokenAdmin.findOne({Username:result._id});
                    data2.exec(function(err,result2){
                    if(result2 == null){
                    var input =  new  tokenAdmin({
                        Username  : result._id,
                        Token     : token,
                        CreatedAt : moment(moment(new Date()), 'MM/DD/YYYY').format()
                    })
                    input.save(function(err,result){
                    res.json({
                        Hasil   : true,
                        Message : "Berhasil",
                        Token   : token
                    })
                })
            }else {
                var dataOld = { _id : result2._id};
                var datanew = { Token : token,
                                CreatedAt:moment(moment(new Date()), 'MM/DD/YYYY').format()
                                }
                var options = {};
                tokenAdmin.update(dataOld, datanew, options, callback);
                function callback(err,result){
                    res.json({
                        Hasil   : true,
                        Message : "Berhasil",
                        Token   : token
                    })
                }
                
            }
        })
                } else{
                    res.json({
                        Hasil   : false,
                        Message : "Password Salah",
                        Token   : ""
                    })
                }
            })   
            } else{
                res.json({
                    Hasil   : false,
                    Message :"Username tidak ditemukan",
                    Token   : ""
                })
            }
    })
})

router.post('/logout',function(req,res,next){
    let header = req.header('Authorization');
    let data   = tokenAdmin.remove({Token:header});
    data.exec(function(err,result){
        res.json({
            hasil   : true,
            message : "berhasil"
        })
    })
})


router.post('/register/admin', function(req,res,next){
    let header = req.header('Authorization');
    let data   = tokenAdmin.findOne({Token:header});
    
    data.exec(function(err,result){
        if(result != null){
            jwt.verify(header, 'Login', function(err,data){
                if (err) {
                    res.json({
                        Hasil : false,
                        Message : "Login Dulu"
                    })
                }else{
                    var data2 = admin.findOne({Username: data.username});
                    data2.exec(function(err,result2){
                        if(result2 != null){
                            if(result2.Level == 1){
                                        var data3 = banksampah.findOne({Kode: req.body.banksampah});
                                        data3.exec(function(err,result3){
                                            if(result3 != null){
                                                var data4 = admin.findOne({$or : [{Username: req.body.username},{Email: req.body.email},{NomorTelepon: req.body.nomorTelepon}]});
                                                data4.exec(function(err,result4){
                                                    if(result4 == null){
                                                        var password = req.body.password;
                                                        var username = req.body.username;
                                                        var Hp       = req.body.nomorTelepon;
                                                        let regexUser= /[^A-Za-z0-9]+/g.test(password);
                                                        let regexPass= /[^A-Za-z0-9]+/g.test(username);
                                                        let regexHp  = /[^0-9]+/g.test(Hp);

                                                        if (regexUser == false && regexPass == false && regexHp == false && password.length > 7 && username.length > 4){
                                                            bcrypt.hash(password, saltRounds, function(err,hash){
                                                                var input  = new admin({
                                                                    Username    : username,
                                                                    Fullname    : req.body.fullname,
                                                                    Password    : hash,
                                                                    Email       : req.body.email,
                                                                    NomorTelepon: Hp,
                                                                    Provinsi    : result3.Provinsi,
                                                                    Kota        : result3.Kota,
                                                                    Kecamatan   : result3.Kecamatan,
                                                                    Desa        : result3.Desa,
                                                                    BankSampah  : result3._id,
                                                                    Foto        : "",
                                                                    Level       : 2,
                                                                    CreatedAt   : moment(moment(new Date()), 'MM/DD/YYYY').format()

                                                                })
                                                                input.save(function(err,result){
                                                                    res.json({
                                                                        Hasil : true,
                                                                        Message : "Berhasil"
                                                                    })
                                                                })
                                                            })
                                                        }else{
                                                            if(regexUser != false){
                                                                res.json({
                                                                    Hasil : false,
                                                                    Message : "Username mengandung selain huru dan angka"
                                                                })
                                                            }else if(regexPass != false){
                                                                res.json({
                                                                    Hasil : false,
                                                                    Message : "Password mengandung selain huru dan angka"
                                                                })
                                                            }else if(regexHp != false){
                                                                res.json({
                                                                    Hasil : false,
                                                                    Message : "No Hp mengandung huruf"
                                                                })
                                                            }else if(password.length < 8){
                                                                res.json({
                                                                    Hasil : false,
                                                                    Message : "Pasword krang panjang"
                                                                })
                                                            }else if(username.length < 5){
                                                                res.json({
                                                                    Hasil : false,
                                                                    Message : "usernmae kurang panjang"
                                                                })
                                                            }else {
                                                                res.json({
                                                                    Hasil : false,
                                                                    Message : "Gagal Register"
                                                                })
                                                            }
                                                        }
                                                    }
                                                })
                                            }else{
                                                res.json({
                                                    Hasil : false,
                                                    Message : " dAta bank sampah tidak ditemukan"
                                                })
                                            }
                                        })
                            }else{
                                res.json({
                                    Hasil  : false,
                                    Message :"Tidak ada data2"
                                })
                            }
                        }else{
                            res.json({
                                Hasil : false,
                                Message : "Tidak ada data3"
                            })
                        }
                    })
                }
            })
        }else{
            res.json({
                Hasil : false,
                Message : "tidak ada data4"
            })
        }
    })
})