const vendor = require('../../models/vendorModel')
const twilio = require('twilio')

const sendMessage = (mobile,reason,status)=> {
    mobile = Number(mobile)
    const accountSid = 'AC3495ecdabd3d4cf06336cd610d0e6745';
    const authToken = 'f5f51816523bd05fe04e029695201f7a';
    const client = twilio(accountSid, authToken);
    const message = `Enturf Booking  - Your venue manager application has been ${status}. ${reason ? `reason : ${reason}` : '' }`;
    client.messages
      .create({
        body: message,
        from: process.env.myMobile,
        to: `+91${mobile}`
      })
      .catch(error =>{
        console.error(error)
      });
}

module.exports = {
    getVms: async (req, res) => {
        try {
          const vmsDatas = await vendor.find();
          console.log(vmsDatas);
          res.status(200).json(vmsDatas);
        } catch (error) {
          console.error(error.message);
          res.status(400).json({ message: 'Error occurred' });
        }
      },
      
    blockVm: async (req, res) => {
        const { _id } = req.body;
        if(!_id)  return res.status(400).json({message:'_id - vm id field is required'})
        await vendor.updateOne({ _id }, [{ "$set": { "blockStatus": { "$eq": [false, "$blockStatus"] } } }]).then(response => {
            res.sendStatus(200);
        }).catch(err=>{
            console.log(err.message);
            res.status(400).json({message:'error occured'})
        })
    },
    changeStatus: async (req,res) => {
        const { vmId,status,reason } = req.body;
        if(!vmId || !status) return res.status(400).json({message:'vmId,status - fields is required'})
        await vendor.findOneAndUpdate({_id:vmId},{"$set":{status,reason}}).then(async (response)=>{
            sendMessage(response.mobile,reason,status)
            res.sendStatus(200);
        })
    }
}