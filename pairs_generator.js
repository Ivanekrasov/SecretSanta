"use strict";
const _ = require('lodash');
const crypto = require('crypto');
const upperLimitUInt32 = Math.pow(2, 32) - 1;

function random_safe(limit) {
    return ~~(crypto.randomBytes(4).readUInt32LE() / upperLimitUInt32 * limit);
}

function generate(participants) {
  //swap nulls with rand nums
  const noNullParticipants = participants.map(participant => ({
    ...participant,
    pair: participant.pair || _.random(participants.length,participants.length + 1000)
  }));
  let present_pairs = [];
  let participants_copy = participants.slice(0, participants.length);
  while (noNullParticipants.length > 0) {
    const pick_sender = random_safe(noNullParticipants.length);
    let pick_receiver = random_safe(participants_copy.length);

    // when only two persons are left, pick manually the only viable option
    // if it wasn't already picked
    if (noNullParticipants.length === 2 &&
        (noNullParticipants[pick_sender].email === participants_copy[pick_receiver].email
         || noNullParticipants[~~!pick_sender].email === participants_copy[~~!pick_receiver].email)
       ) {
        pick_receiver = ~~!pick_receiver;
    } else if (
      noNullParticipants[pick_sender].email === participants_copy[pick_receiver].email
    ) {
      // if we chose the same person, skip
      continue;
    }
    if (noNullParticipants[pick_sender].pair === participants_copy[pick_receiver].pair) continue;

    const pick = {
      sender: noNullParticipants.splice(pick_sender, 1)[0],
      receiver: participants_copy.splice(pick_receiver, 1)[0],
      toString() {
        return `${this.sender.name} ⇾ ${this.receiver.name} (${this.receiver.sex})`;
      }
    };

    present_pairs.push(pick);
  }
  console.log('got pairs!');
  return present_pairs;
}

module.exports = { generate, random_number: random_safe, default: generate };
