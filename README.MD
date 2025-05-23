
# Rhythmix

**Rhythmix** is a modern and intuitive web-based music player application designed to provide a seamless music listening experience. With a sleek interface and powerful features, Rhythmix lets you enjoy your favorite tracks anytime, anywhere.

---

## 🎵 Features

- **Play, Pause, and Skip Tracks**: Control your music effortlessly.
- **Playlist Management**: Create, edit, and organize playlists.
- **Search Functionality**: Quickly find your favorite songs or artists.
- **Responsive Design**: Enjoy a smooth experience on any device.
- **Customizable Themes**: Personalize the look and feel of the app.

---

## 🛠 Technologies Used

- **Frontend**: HTML, CSS, JavaScript, React.js  
- **Backend**: Spring Boot, Java  
- **Database**: MongoDB, PostgreSQL

---

## 🚀 Getting Started with Docker Compose

### Prerequisites

- Docker  
- Docker Compose

### Clone the Repository

```bash
git clone https://github.com/i-am-vaibhav/rhythmix.git
cd rhythmix
```

### Build and Run the Application

```bash
docker-compose up --build
```

This command will:

- Build all frontend and backend services.  
- Set up and start all containers (including PostgreSQL and the Config Server).  
- Expose the following services on your local machine:

| **Service**               | **URL**                     |
|--------------------------|-----------------------------|
| Rhythmix Web Frontend    | http://localhost:5173       |
| Rhythmix Player Web      | http://localhost:3000       |
| Rhythmix Library Web     | http://localhost:3001       |
| Rhythmix Home Web        | http://localhost:3002       |
| Config Server            | http://localhost:8888       |
| Gateway                  | http://localhost:8761       |
| Auth Service             | http://localhost:8100       |
| Song Service             | http://localhost:8200       |
| User Service             | http://localhost:8080       |
| PostgreSQL Database      | localhost:5432              |

### Stopping the Application

To stop the running containers:

```bash
docker-compose down
```

To stop and remove all containers, networks, and volumes:

```bash
docker-compose down -v
```

---

### 📍 Notes

- Make sure no other services are running on the ports mentioned above.
- PostgreSQL is configured with the following credentials:
  - **Username**: `rhythmix`
  - **Password**: `rhythmix`
  - **Database**: `rhythmix`

---

### 📂 Project Structure

```
.
├── backend
│   ├── rhythmix-auth-service
│   ├── rhythmix-config-server
│   ├── rhythmix-gateway
│   ├── rhythmix-song-service
│   └── rhythmix-user-services
├── frontend
│   ├── rhythmix-home-web
│   ├── rhythmix-library-web
│   ├── rhythmix-player-web
│   └── rhythmix-web
└── docker-compose.yml
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For any questions or feedback, feel free to reach out at:  
📧 [vgworks566556@gmail.com](mailto:vgworks566556@gmail.com)
