const Room = require("../models/Room");

class roomController {
  show(req, res, next) {
    Room.find({})
      .sort({ _id: 1 })
      .then((Room) => {
        Room = Room.map((Room) => Room.toObject());
        res.render("rooms/room", { Room });
      })
      .catch(next);
  }
  create(req, res, next) {
    res.render("rooms/create");
  }
  created(req, res, next) {
    const room = new Room(req.body);
    room.status = "uncheck";
    room
      .save()
      .then(() => res.redirect("/room"))
      .catch(next);
  }
  edit(req, res, next) {
    Room.findById(req.params.id)
      .then((Room) => {
        Room = Room.toObject();
        res.render("rooms/edit", { Room });
      })
      .catch(next);
  }
  update(req, res, next) {
    if (req.body.status == "true") {
      req.body.status = "checked";
    } else {
      req.body.status = "uncheck";
    }
    Room.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/room"))
      .catch(next);
  }
  delete(req, res, next) {
    Room.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("/room"))
      .catch(next);
  }
}

module.exports = new roomController();
