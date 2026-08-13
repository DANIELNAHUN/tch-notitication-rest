<template>
    <div class="form-container">
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="receiver_id">Receiver ID:</label>
                <input type="number" id="receiver_id" v-model="receiver_id" required>
            </div>
            <div class="form-group">
                <label for="subject">Subject:</label>
                <input type="text" id="subject" v-model="subject" required>
            </div>
            <div class="form-group">
                <label for="message">Message:</label>
                <input type="text" id="message" v-model="message" required>
            </div>
            <div class="form-group">
                <label for="channel">Channel:</label>
                <select id="channel" v-model="channel" required>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                </select>
            </div>
            <div v-if="channel === 'sms' || channel === 'push'">
                <label for="receiver_contact">Receiver Contact:</label>
                <input type="text" id="receiver_contact" v-model="receiver_contact" required>
            </div>
            <div v-if="channel === 'sms' || channel === 'push'">
                <label for="sender_contact">Sender Contact:</label>
                <input type="text" id="sender_contact" v-model="sender_contact" required>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { createNotification } from '../services/notification';

const receiver_id = ref('');
const subject = ref('');
const message = ref('');
const channel = ref('');
const receiver_contact = ref('');
const sender_contact = ref('');
const formData = ref({
    receiver_id: '',
    subject: '',
    message: '',
    channel: '',
    receiver_contact: '',
    sender_contact: '',
});

const submitForm = async () => {
    try {
        formData.value = {
            sender_id: localStorage.getItem("id_user"),
            receiver_id: receiver_id.value,
            subject: subject.value,
            message: message.value,
            channel: channel.value,
        };
        if (channel.value !== 'email') {
            formData.value.receiver_contact = receiver_contact.value;
            formData.value.sender_contact = sender_contact.value;
        }
        console.log(formData.value);
        const response = await createNotification(formData.value);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
};
</script>