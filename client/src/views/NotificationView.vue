<template>
    <div class="page-container">
        <nav class="navbar">
            <div class="navbar-content">
                <h2>Mis notificaciones - {{ user.user_name }}</h2>
                <div class="nav-actions">
                    <button class="btn" @click="openModal">Crear</button>
                    <button class="btn btn-logout" @click="logout">Cerrar Sesión</button>
                </div>
            </div>
        </nav>
        <FormNoti v-if="showModal" @close="closeModal" />

        <main class="content">
            <ul v-if="notifications.length" class="notifications-list simple">
                <li v-for="noti in notifications" :key="noti.id_notification" class="notification-card simple">
                    <div class="card-header">
                        <h3 class="subject">{{ noti.subject }}</h3>
                        <span class="badge channel">{{ noti.channel }}</span>
                    </div>
                    <p class="message">{{ noti.message }}</p>
                    <div class="card-footer">
                        <span>
                            {{ noti.sender_contact }} -> {{ noti.receiver_contact }}
                        </span>
                        <span class="badge status">{{ noti.status }}</span>
                    </div>
                </li>
            </ul>
            <p v-else class="empty-state">No hay notificaciones</p>
        </main>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { notificationService } from '../services/notification';
import { getMe } from '../services/user';
import FormNoti from '../components/FormNoti.vue';

const router = useRouter();

const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
};

const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const notifications = ref([]);
const user = ref({ user_name: '' });
const showModal = ref(false);

onMounted(async () => {
    try {
        notifications.value = await notificationService();
        user.value = await getMe();
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped>
.page-container {
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.navbar {
    background-color: #2c3e50;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin: 0px;
    width: 100%;
    top: 0%;
    position: fixed;

}

.navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 1rem;
    margin-right: 1rem;
}

.navbar h2 {
    margin: 0;
    font-size: 1.25rem;
}

.nav-actions {
    display: flex;
    gap: 0.5rem;
}

.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #42b983;
    color: white;
    font-weight: 500;
}

.btn-logout {
    background-color: #e74c3c;
}

.notifications-list.simple {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.notification-card.simple {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.subject {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
}

.message {
    margin: 0.5rem 0;
    color: #555;
}

.card-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
}

.badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: bold;
}

.badge.channel {
    background-color: #e3f2fd;
    color: #1976d2;
}

.badge.status {
    background-color: #e8f5e9;
    color: #388e3c;
}

.empty-state {
    text-align: center;
    color: #888;
}
</style>