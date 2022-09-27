const {mysql} = require('./datasource/rds')
const{frdb} = require('./datasource/firebase')
const {ref, onValue, update, remove} = require('firebase/database')

deleteCallCard().then(r => console.log("Removing Old CallCard"))
setDriverCallReceivingStatus().then(r => console.log("Set Drivers Call-Receiving-Status"))

async function deleteCallCard() {
    try {
        const [callIdList] = await mysql.promise().query(`select id from k_call where create_date < '2022-09-27'`)
        for (const callInfo of callIdList) {
            let callCardRef = await ref(frdb, `callList/${callInfo.id}`)
            onValue(callCardRef, async snapshot => {
                const callCard = snapshot.val()
                if(callCard != null
                    && (callCard.status === 'CALL_USER_CANCEL'
                        || callCard.status === 'CALL_STAFF_CANCEL'
                        || callCard.status ==='CALL_CANCELED'
                        || callCard.status === 'CALL_WAITING')) {
                    console.log('---')
                    console.log(`${snapshot.key} / ${callCard.status} is removed from frdb`)
                    // await remove(ref(frdb, `callList/${snapshot.key}`))
                }
            })
        }
    } catch (e) {
        console.error(e)
    }
}

async function setDriverCallReceivingStatus() {
    try {
        const [rows] = mysql.promise().query('select * from driver where is_deleted=false')
        console.log(`result count : ${rows.length}`)
        for (const row of rows) {
            let driverRef = ref(frdb, '/driverList/' + row.id)
            onValue(driverRef, async (snapshot) => {
                const firebaseDriver = snapshot.val()
                if (firebaseDriver != null && firebaseDriver.callReceivingStatus != null && (row.call_receiving_status != firebaseDriver.callReceivingStatus)) {
                    console.log(`[${row.id}] RDB : ${row.call_receiving_status} --- FRDB : ${firebaseDriver.callReceivingStatus}`)
                    const updates = {};
                    updates['/callReceivingStatus'] = row.call_receiving_status;
                    await update(driverRef, updates)
                }
            })

        }
    } catch (e) {
        console.error(e)
    }
}