const Ultility = require("../models/Ultility");
const Room = require("../models/Room");

class ultilityController {
  show(req, res, next) {
    var monthNew;
    var yearNew;
    if (req.query.month && req.query.year !== "") {
      monthNew = req.query.month;
      yearNew = req.query.year;
    } else {
      monthNew = req.cookies["monthLast"];
      yearNew = req.cookies["yearLast"];
    }
    if (monthNew == undefined || yearNew == undefined) {
      monthNew = 1;
      yearNew = 2023;
    }
    res.cookie("monthLast", monthNew);
    res.cookie("yearLast", yearNew);

    var monthOld;
    var yearOld;
    if (monthNew == 1) {
      monthOld = 12;
      yearOld = yearNew - 1;
    } else {
      monthOld = monthNew - 1;
      yearOld = yearNew;
    }

    let ultilitiesNew;
    let ultilitiesNewPromise = Ultility.find({ month: monthNew, year: yearNew })
      .sort({ _id: 1 })
      .then((Ultility) => {
        ultilitiesNew = Ultility.map((Ultility) => Ultility.toObject());
      });

    let ultilitiesOld;
    let ultilitiesOldPromise = Ultility.find({ month: monthOld, year: yearOld })
      .sort({ _id: 1 })
      .then((Ultility) => {
        ultilitiesOld = Ultility.map((Ultility) => Ultility.toObject());
      });
    Promise.all([ultilitiesNewPromise, ultilitiesOldPromise])
      .then(() => {
        const nameNew = ultilitiesNew.map(
          (ultilitiesNew) => ultilitiesNew.name
        );
        const monthNew = ultilitiesNew.map(
          (ultilitiesNew) => ultilitiesNew.month
        );
        const yearNew = ultilitiesNew.map(
          (ultilitiesNew) => ultilitiesNew.year
        );
        const electricityNew = ultilitiesNew.map(
          (ultilitiesNew) => ultilitiesNew.electricity
        );
        const waterNew = ultilitiesNew.map(
          (ultilitiesNew) => ultilitiesNew.water
        );

        const nameOld = ultilitiesOld.map(
          (ultilitiesOld) => ultilitiesOld.name
        );
        const monthOld = ultilitiesOld.map(
          (ultilitiesOld) => ultilitiesOld.month
        );
        const yearOld = ultilitiesOld.map(
          (ultilitiesOld) => ultilitiesOld.year
        );
        const electricityOld = ultilitiesOld.map(
          (ultilitiesOld) => ultilitiesOld.electricity
        );
        const waterOld = ultilitiesOld.map(
          (ultilitiesOld) => ultilitiesOld.water
        );
        var Ultilities = [];
        for (let i = 0; i < nameNew.length; i++) {
          if (nameNew[i] == nameOld[i]) {
            Ultilities.push({
              name: nameNew[i],
              monthNew: monthNew[i],
              yearNew: yearNew[i],
              electricityNew: electricityNew[i],
              waterNew: waterNew[i],
              monthOld: monthOld[i],
              yearOld: yearOld[i],
              electricityOld: electricityOld[i],
              waterOld: waterOld[i],
              electricityTotal: electricityNew[i] - electricityOld[i],
              waterTotal: waterNew[i] - waterOld[i],
            });
          } else {
            //Updating
          }
        }
        // console.log(Ultilities)
        res.render("ultilities/ultility", {
          Ultilities,
          monthNew: monthNew,
          yearNew: yearNew,
        });
      })
      .catch(next);
  }
  add(req, res, next) {
    Room.find({})
      .sort({ _id: 1 })
      .then((Room) => {
        Room = Room.map((Room) => Room.toObject());
        res.render("ultilities/add", { Room });
      });
  }
  save(req, res, next) {
    Room.find({})
      .then((Room) => {
        Room = Room.map((Room) => Room.toObject());
        const name = Room.map((Room) => Room.name);
        const electricity = req.body.electricity;
        const water = req.body.water;
        const month = req.body.month;
        const year = req.body.year;

        Ultility.find({ month: month, year: year })
          .then((checkUltility) => {
            if (checkUltility.length == 0) {
              var ultilityroom = [];
              for (let i = 0; i < name.length; i++) {
                ultilityroom.push({
                  name: name[i],
                  month: month,
                  year: year,
                  electricity: electricity[i],
                  water: water[i],
                });
              }
              console.log(ultilityroom);
              Ultility.create(ultilityroom)
                .then(() => res.redirect("/ultility"))
                .catch(next);
            } else {
              res.redirect("/ultility");
            }
          })
          .catch(next);
      })
      .catch(next);
  }

  edit(req, res, next) {
    const month = req.cookies["monthLast"];
    const year = req.cookies["yearLast"];
    Ultility.find({ month: month, year: year })
      .sort({ _id: 1 })
      .then((Ultility) => {
        Ultility = Ultility.map((Ultility) => Ultility.toObject());
        const id = Ultility.map((Ultility) => Ultility._id);
        res.cookie("ids", id);
        res.render("ultilities/edit", { Ultility, month, year });
      })
      .catch(next);
  }

  update(req, res, next) {
    const ids = req.cookies["ids"];
    const electricity = req.body.electricity;
    const water = req.body.water;
    for (let i = 0; i < ids.length; i++) {
      Ultility.updateMany(
        { _id: ids[i] },
        { $set: { electricity: electricity[i], water: water[i] } }
      ).then(() => {});
    }
    res.redirect("/ultility");
  }
}

module.exports = new ultilityController();
