const Payment = require('../models/Payment');
const Ultility = require('../models/Utility');

class paymentController {
    show(req, res, next) {
        var month;
        var year;
        if (req.query.month && req.query.year) {
            month = req.query.month;
            year = req.query.year;
        }
        else {
            month = req.cookies['monthLast'];
            year = req.cookies['yearLast'];
        }
        if (month == undefined || year == undefined) {
            month = 1;
            year = 2023;
        }
        res.cookie('monthLast', month);
        res.cookie('yearLast', year);
        Payment.find({ month: month, year: year })
            .then(Payment => {
                Payment = Payment.map(Payment => Payment.toObject());
                Payment.forEach(item => {
                    item.totalPay = parseFloat(item.totalPay).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                    item.wTotal = parseFloat(item.wTotal).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                    item.eTotal = parseFloat(item.eTotal).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                    if (item.status == "true"){
                        item.status = "checked";
                    }
                    else{
                        item.status = "";
                    }
                });
                res.render('payments/payment', { Payment });
            })
            .catch(next)

    }
    create(req, res, next) {
        var monthNewTemp = req.query.month;
        var yearNewTemp = req.query.year;
        var monthOldTemp;
        var yearOldTemp;
        if (monthNewTemp == 1) {
            monthOldTemp = 12;
            yearOldTemp = yearNewTemp - 1;
        }
        else {
            monthOldTemp = monthNewTemp - 1;
            yearOldTemp = yearNewTemp;
        }

        let ultilitiesNew;
        const ultilitiesNewPromise = Ultility.find({ month: monthNewTemp, year: yearNewTemp })
            .sort({ _id: 1 })
            .then(Ultility => {
                ultilitiesNew = Ultility.map(Ultility => Ultility.toObject());
                if (ultilitiesNew.length == 0) {
                    res.redirect('/manage');
                }
            });

        let ultilitiesOld;
        const ultilitiesOldPromise = Ultility.find({ month: monthOldTemp, year: yearOldTemp })
            .sort({ _id: 1 })
            .then(Ultility => {
                ultilitiesOld = Ultility.map(Ultility => Ultility.toObject());
                if (ultilitiesOld.length == 0) {
                    res.redirect('/manage');
                }
            });
        Promise.all([ultilitiesNewPromise, ultilitiesOldPromise])
            .then(() => {
                if (ultilitiesNew.length != ultilitiesOld.length) {
                    res.redirect('/payment?month=' + monthOldTemp + '&year=' + yearOldTemp);
                }
                const nameNew = ultilitiesNew.map(ultilitiesNew => ultilitiesNew.name);
                const monthNew = ultilitiesNew.map(ultilitiesNew => ultilitiesNew.month);
                const yearNew = ultilitiesNew.map(ultilitiesNew => ultilitiesNew.year);
                const electricityNew = ultilitiesNew.map(ultilitiesNew => ultilitiesNew.electricity);
                const waterNew = ultilitiesNew.map(ultilitiesNew => ultilitiesNew.water);

                const nameOld = ultilitiesOld.map(ultilitiesOld => ultilitiesOld.name);
                const monthOld = ultilitiesOld.map(ultilitiesOld => ultilitiesOld.month);
                const yearOld = ultilitiesOld.map(ultilitiesOld => ultilitiesOld.year);
                const electricityOld = ultilitiesOld.map(ultilitiesOld => ultilitiesOld.electricity);
                const waterOld = ultilitiesOld.map(ultilitiesOld => ultilitiesOld.water);
                var Ultilities = [];
                var eTotal, wTotal, totalPay;
                for (let i = 0; i < nameNew.length; i++) {
                    if (nameNew[i] == nameOld[i]) {
                        eTotal = (electricityNew[i] - electricityOld[i]) * 4000;
                        wTotal = (waterNew[i] - waterOld[i]) * 6000;
                        totalPay = eTotal + wTotal + 20000;
                        Ultilities.push({
                            name: nameNew[i],
                            month: monthNew[i],
                            year: yearNew[i],
                            eNew: electricityNew[i],
                            wNew: waterNew[i],
                            eOld: electricityOld[i],
                            wOld: waterOld[i],
                            eConsumption: electricityNew[i] - electricityOld[i],
                            wConsumption: waterNew[i] - waterOld[i],
                            eTotal: eTotal,
                            wTotal: wTotal,
                            totalPay: totalPay,
                            status: false
                        })
                    }
                    else {
                        //updating...
                    }
                }
                Ultilities.forEach((Ultility) => {
                    Payment.create(Ultility)
                        .then()
                        .catch(next)
                })
                res.redirect('/payment?month=' + monthNewTemp + '&year=' + yearNewTemp);
            })
            .catch(next);
    }
    pay(req, res, next){
        const id = req.query.id;
        Payment.updateOne({_id: id}, {status: "true"})
            .then(() => res.redirect('/payment'))
            .catch(next)
    }

    print(req, res, next) {
        const month = req.query.month;
        const year = req.query.year;
        Payment.find({ month: month, year: year })
            .then(Payment => {
                Payment = Payment.map(Payment => Payment.toObject());
                Payment.forEach(item => {
                    item.totalPay = parseFloat(item.totalPay).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                    item.wTotal = parseFloat(item.wTotal).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                    item.eTotal = parseFloat(item.eTotal).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                });
                res.render('payments/print', { Payment });
            })

    }
}

module.exports = new paymentController;