const sports = require('../../models/sportsModel')

module.exports = {
  addSports: async (req, res) => {
    console.log(req.body);
    try {
      const { sport, facility } = req.body;
      if (!facility || !sport) {
        return res.status(400).json({ message: "facility and sport fields are required" });
      }
  
      const existingSport = await sports.findOne({ sport });
      if (existingSport) {
        const existingFacility = existingSport.facilityDetails.find(item => item.facility === facility);
        if (existingFacility) {
          return res.status(400).json({ message: "Sport and facility already exist" });
        } else {
          existingSport.facilityDetails.push({
            facility,
            count: 0,
            status: true
          });
          await existingSport.save();
         
          return res.status(200).json({ message: 'Sport and facility added successfully' });
        }
      }
  
      const newSport = await sports.create({
        sport,
        facilityDetails: [
          {
            facility,
            count: 0,
            status: true
          }
        ]
      });
  
      console.log(newSport);
      res.status(200).json({ message: 'Sport added successfully' });
    } catch (error) {
      console.error('Error adding sport:', error);
      res.status(500).json({ message: 'Failed to add sport' });
    }
  },
  
  getSports: async (req, res) => {
    try {
      const sportsDatas = await sports.find();
      res.status(200).json({ sportsDatas });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ message: 'error occurred' });
    }
  },
  changeStatus: async (req, res) => {
    console.log(req.body)
    try {
      const { _id, facility, status } = req.body
      if (!_id || !facility || !status) {
        return res.status(400).json({ message: "_id, facility, status - fields required" });
      }

      await sports.updateOne({ _id }, { $set: { "facilityDetails.$[elem].status": status } }, { arrayFilters: [{ "elem.facility": facility }] });
      res.sendStatus(200);
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ message: "error occurred" });
    }
  },
}