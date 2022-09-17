const {mysql} = require('./datasource/rds')
const{frdb} = require('./datasource/firebase')
const {ref, onValue, update} = require('firebase/database')

try {
    mysql.query(
        sql = 'select * from driver where is_deleted=false',
        callback = async (err, rows) => {
        if (err) {
            console.log({err})
        } else {
            console.log('result of rows = ', rows.length)
            for (const row of rows) {
                let driverRef = ref(frdb, '/driverList/' + row.id)
                onValue(driverRef, async (snapshot) => {
                    const data = snapshot.val()
                    if (data != null && data.callReceivingStatus != null && (row.call_receiving_status != data.callReceivingStatus)) {
                        console.log(row.id)
                        console.log(row.call_receiving_status)
                        console.log(data.callReceivingStatus)

                        const updates = {};
                        updates['/callReceivingStatus'] = row.call_receiving_status;
                        await update(driverRef, updates)
                    }
                })
            }
        }
    })
} catch (e) {
    console.log({e})
}