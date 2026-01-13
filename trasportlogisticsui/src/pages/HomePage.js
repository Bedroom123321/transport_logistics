import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import { loginClient, registerClient } from '../services/ClientService';
import { getAllDrivers, createDriver, updateDriver, deleteDriver } from '../services/DriverService';
import { getAllTrucks, createTruck, updateTruck, deleteTruck } from '../services/TruckService';
import { getAllClients, updateClient, deleteClient } from '../services/ClientService';
import { createOrder, getAllOrdersWithRelations, updateOrder, deleteOrder } from '../services/OrderService';
import homepageImage from '../images/homepage.png';
import orderIcon from '../images/order_icon.png';
import loadingIcon from '../images/loading_icon.png';
import deliveryIcon from '../images/delivery_icon.png';
import unloadingIcon from '../images/unloading_icon.png';

function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showAddOrder, setShowAddOrder] = useState(false);
    const [loginData, setLoginData] = useState({ login: '', password: '' });
    const [registerData, setRegisterData] = useState({ firstName: '', lastName: '', phoneNumber: '', login: '', password: '' });
    const [orderData, setOrderData] = useState({ loadingPoint: '', deliveryPoint: '', clientId: '', driverId: '', truckId: '', id: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [view, setView] = useState('home');
    const [drivers, setDrivers] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [clients, setClients] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddDriver, setShowAddDriver] = useState(false);
    const [showEditDriver, setShowEditDriver] = useState(false);
    const [showDeleteDriver, setShowDeleteDriver] = useState(false);
    const [showAddTruck, setShowAddTruck] = useState(false);
    const [showEditTruck, setShowEditTruck] = useState(false);
    const [showDeleteTruck, setShowDeleteTruck] = useState(false);
    const [showEditClient, setShowEditClient] = useState(false);
    const [showDeleteClient, setShowDeleteClient] = useState(false);
    const [showEditOrder, setShowEditOrder] = useState(false);
    const [showDeleteOrder, setShowDeleteOrder] = useState(false);
    const [driverData, setDriverData] = useState({ firstName: '', lastName: '', phoneNumber: '', workExperience: '' });
    const [truckData, setTruckData] = useState({ numberPlate: '', liftingCapacity: '', cargoVolume: '', cargoType: '' });
    const [clientData, setClientData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loggedInClient, setLoggedInClient] = useState(null);

    // Функция для очистки сообщения через 3 секунды
    const clearErrorMessage = () => {
        setTimeout(() => {
            setErrorMessage('');
        }, 3000);
    };

    useEffect(() => {
        if (view === 'drivers') {
            fetchDrivers();
        } else if (view === 'trucks') {
            fetchTrucks();
        } else if (view === 'clients') {
            fetchClients();
        } else if (view === 'orders') {
            fetchOrders();
        }
    }, [view]);

    useEffect(() => {
        if (showAddOrder || showEditOrder) {
            fetchDrivers();
            fetchTrucks();
            if (loggedInClient) {
                setOrderData(prev => ({ ...prev, clientId: loggedInClient.id }));
            }
        }
    }, [showAddOrder, showEditOrder, loggedInClient]);

    const fetchDrivers = async () => {
        try {
            const response = await getAllDrivers();
            setDrivers(response);
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка загрузки водителей');
            clearErrorMessage();
        }
    };

    const fetchTrucks = async () => {
        try {
            const response = await getAllTrucks();
            setTrucks(response);
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка загрузки грузовиков');
            clearErrorMessage();
        }
    };

    const fetchClients = async () => {
        try {
            const response = await getAllClients();
            setClients(response);
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка загрузки клиентов');
            clearErrorMessage();
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await getAllOrdersWithRelations();
            setOrders(response);
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка загрузки заказов');
            clearErrorMessage();
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const toggleLogin = () => {
        setShowLogin(prev => {
            const newState = !prev;
            if (!newState) {
                setLoginData({ login: '', password: '' });
            } else {
                setRegisterData({ firstName: '', lastName: '', phoneNumber: '', login: '', password: '' });
            }
            return newState;
        });
        setShowRegister(false);
        setErrorMessage('');
    };

    const toggleRegister = () => {
        setShowRegister(prev => {
            const newState = !prev;
            if (!newState) {
                setRegisterData({ firstName: '', lastName: '', phoneNumber: '', login: '', password: '' });
            } else {
                setLoginData({ login: '', password: '' });
            }
            return newState;
        });
        setShowLogin(false);
        setErrorMessage('');
    };

    const toggleAddOrder = () => {
        setShowAddOrder(prev => {
            const newState = !prev;
            if (!newState) {
                setOrderData({ loadingPoint: '', deliveryPoint: '', clientId: '', driverId: '', truckId: '', id: '' });
            } else if (loggedInClient) {
                setOrderData({ loadingPoint: '', deliveryPoint: '', clientId: loggedInClient.id, driverId: '', truckId: '', id: '' });
            }
            return newState;
        });
        setErrorMessage('');
    };

    const toggleAddDriver = () => {
        setShowAddDriver(prev => {
            const newState = !prev;
            if (!newState) {
                setDriverData({ firstName: '', lastName: '', phoneNumber: '', workExperience: '' });
            }
            return newState;
        });
        setErrorMessage('');
    };

    const toggleEditDriver = () => {
        setShowEditDriver(prev => {
            const newState = !prev;
            if (newState && selectedDriver) {
                setDriverData({
                    firstName: selectedDriver.firstName,
                    lastName: selectedDriver.lastName,
                    phoneNumber: selectedDriver.phoneNumber,
                    workExperience: selectedDriver.workExperience
                });
            } else {
                setDriverData({ firstName: '', lastName: '', phoneNumber: '', workExperience: '' });
            }
            return newState;
        });
        setErrorMessage('');
    };

    const toggleDeleteDriver = () => {
        setShowDeleteDriver(prev => !prev);
        setErrorMessage('');
    };

    const toggleAddTruck = () => {
        setShowAddTruck(prev => {
            const newState = !prev;
            if (!newState) {
                setTruckData({ numberPlate: '', liftingCapacity: '', cargoVolume: '', cargoType: '' });
            }
            return newState;
        });
        setErrorMessage('');
    };

    const toggleEditTruck = () => {
        setShowEditTruck(prev => {
            const newState = !prev;
            if (newState && selectedTruck) {
                setTruckData({
                    numberPlate: selectedTruck.numberPlate,
                    liftingCapacity: selectedTruck.liftingCapacity,
                    cargoVolume: selectedTruck.cargoVolume,
                    cargoType: selectedTruck.cargoType
                });
            } else {
                setTruckData({ numberPlate: '', liftingCapacity: '', cargoVolume: '', cargoType: '' });
            }
            return newState;
        });
        setErrorMessage('');
    };

    const toggleDeleteTruck = () => {
        setShowDeleteTruck(prev => !prev);
        setErrorMessage('');
    };

    const toggleEditClient = () => {
        setShowEditClient(prev => {
            const newState = !prev;
            if (newState && selectedClient) {
                setClientData({
                    firstName: selectedClient.firstName,
                    lastName: selectedClient.lastName,
                    phoneNumber: selectedClient.phoneNumber
                });
            } else {
                setClientData({ firstName: '', lastName: '', phoneNumber: '' });
            }
            return newState;
        });
        setErrorMessage('');
    };

    const toggleDeleteClient = () => {
        setShowDeleteClient(prev => !prev);
        setErrorMessage('');
    };

    const toggleEditOrder = (order) => {
        setShowEditOrder(prev => {
            const newState = !prev;
            if (newState && order) {
                setOrderData({
                    id: order.id,
                    loadingPoint: order.loadingPoint,
                    deliveryPoint: order.deliveryPoint,
                    clientId: loggedInClient ? loggedInClient.id : '',
                    driverId: order.driver.id,
                    truckId: order.truck.id,
                });
                setSelectedOrder(order);
            } else {
                setOrderData({ loadingPoint: '', deliveryPoint: '', clientId: '', driverId: '', truckId: '', id: '' });
                setSelectedOrder(null);
            }
            return newState;
        });
        setErrorMessage('');
    };

    const toggleDeleteOrder = (order) => {
        setShowDeleteOrder(prev => {
            const newState = !prev;
            if (newState) {
                setSelectedOrder(order);
            } else {
                setSelectedOrder(null);
            }
            return newState;
        });
        setErrorMessage('');
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
    };

    const handleOrderChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({ ...prev, [name]: value }));
    };

    const handleDriverChange = (e) => {
        const { name, value } = e.target;
        setDriverData(prev => ({ ...prev, [name]: value }));
    };

    const handleTruckChange = (e) => {
        const { name, value } = e.target;
        setTruckData(prev => ({ ...prev, [name]: value }));
    };

    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setClientData(prev => ({ ...prev, [name]: value }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!loginData.login || !loginData.password) {
            setErrorMessage('Логин и пароль обязательны');
            return;
        }
        try {
            const response = await loginClient(loginData);
            setLoggedInClient(response);
            localStorage.setItem('token', response.token);
            setLoginData({ login: '', password: '' });
            toggleLogin();
            setErrorMessage('Вход выполнен успешно. Пароль: ' + response.password);
            clearErrorMessage();
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка входа');
            clearErrorMessage();
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!registerData.firstName || !registerData.lastName || !registerData.phoneNumber || !registerData.login || !registerData.password) {
            setErrorMessage('Все поля обязательны для заполнения');
            return;
        }
        try {
            const response = await registerClient(registerData);
            setLoggedInClient(response);
            localStorage.setItem('token', response.token);
            setRegisterData({ firstName: '', lastName: '', phoneNumber: '', login: '', password: '' });
            toggleRegister();
            toggleLogin();
            setErrorMessage('Регистрация успешна. Пароль: ' + response.password);
            clearErrorMessage();
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка регистрации');
            clearErrorMessage();
        }
    };

    const handleLogout = () => {
        setLoggedInClient(null);
        localStorage.removeItem('token');
        setErrorMessage('Вы успешно вышли из системы');
        setView('home');
        setOrders([]);
        clearErrorMessage();
    };

    const handleAddOrderSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!orderData.loadingPoint || !orderData.deliveryPoint || !orderData.driverId || !orderData.truckId) {
            setErrorMessage('Все поля обязательны для заполнения');
            clearErrorMessage();
            return;
        }
        if (!loggedInClient) {
            setErrorMessage('Войдите в систему, чтобы оформить заказ');
            clearErrorMessage();
            return;
        }
        try {
            const orderToSend = {
                ...orderData,
                orderDate: new Date().toISOString(),
                clientId: loggedInClient.id,
                driverId: parseInt(orderData.driverId),
                truckId: parseInt(orderData.truckId),
            };
            await createOrder(orderToSend);
            toggleAddOrder();
            fetchOrders();
            setErrorMessage('Заказ успешно оформлен');
            clearErrorMessage();
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка оформления заказа');
            clearErrorMessage();
        }
    };

    const handleEditOrderSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!orderData.loadingPoint || !orderData.deliveryPoint || !orderData.driverId || !orderData.truckId || !orderData.id) {
            setErrorMessage('Все поля обязательны для заполнения');
            clearErrorMessage();
            return;
        }
        try {
            const orderToSend = {
                ...orderData,
                orderDate: new Date().toISOString(),
                clientId: loggedInClient.id,
                driverId: parseInt(orderData.driverId),
                truckId: parseInt(orderData.truckId),
            };
            await updateOrder(orderData.id, orderToSend);
            toggleEditOrder(null); // Устанавливаем null, чтобы сбросить
            fetchOrders();
            setErrorMessage('Заказ успешно обновлен');
            clearErrorMessage();
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка обновления заказа');
            clearErrorMessage();
        }
    };

    const handleDeleteOrderSubmit = async (e) => {
        e.preventDefault();
        if (!selectedOrder) {
            setErrorMessage('Выберите заказ для удаления');
            clearErrorMessage();
            return;
        }
        try {
            await deleteOrder(selectedOrder.id);
            toggleDeleteOrder(null);
            fetchOrders();
            setSelectedOrder(null);
            setErrorMessage('Заказ успешно удален');
            clearErrorMessage();
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка удаления заказа');
            clearErrorMessage();
        }
    };

    const handleAddDriverSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!driverData.firstName || !driverData.lastName || !driverData.phoneNumber || !driverData.workExperience) {
            setErrorMessage('Все поля обязательны для заполнения');
            clearErrorMessage();
            return;
        }
        const phonePattern = /^\+375(17|25|29|33|44)\d{7}$/;
        if (!phonePattern.test(driverData.phoneNumber)) {
            setErrorMessage('Номер должен быть в формате +375XXXXXXXXX');
            clearErrorMessage();
            return;
        }
        try {
            await createDriver(driverData);
            toggleAddDriver();
            fetchDrivers();
            setErrorMessage(''); // Не показываем сообщение об успехе
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка добавления водителя');
            clearErrorMessage();
        }
    };

    const handleEditDriverSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!driverData.firstName || !driverData.lastName || !driverData.phoneNumber || !driverData.workExperience) {
            setErrorMessage('Все поля обязательны для заполнения');
            clearErrorMessage();
            return;
        }
        const phonePattern = /^\+375(17|25|29|33|44)\d{7}$/;
        if (!phonePattern.test(driverData.phoneNumber)) {
            setErrorMessage('Номер должен быть в формате +375XXXXXXXXX');
            clearErrorMessage();
            return;
        }
        try {
            await updateDriver(selectedDriver.id, driverData);
            toggleEditDriver();
            fetchDrivers();
            setSelectedDriver(null);
            setErrorMessage(''); // Не показываем сообщение об успехе
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка обновления водителя');
            clearErrorMessage();
        }
    };

    const handleDeleteDriverSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDriver) {
            setErrorMessage('Выберите водителя для удаления');
            clearErrorMessage();
            return;
        }
        try {
            await deleteDriver(selectedDriver.id);
            toggleDeleteDriver();
            fetchDrivers();
            setSelectedDriver(null);
            setErrorMessage(''); // Не показываем сообщение об успехе
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка удаления водителя');
            clearErrorMessage();
        }
    };

    const handleAddTruckSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!truckData.numberPlate || !truckData.liftingCapacity || !truckData.cargoVolume || !truckData.cargoType) {
            setErrorMessage('Все поля обязательны для заполнения');
            clearErrorMessage();
            return;
        }
        const numberPlatePattern = /^[A-Za-z]{2}\d{5}$/;
        if (!numberPlatePattern.test(truckData.numberPlate)) {
            setErrorMessage('Номер должен быть в формате AB12345');
            clearErrorMessage();
            return;
        }
        const liftingCapacity = parseInt(truckData.liftingCapacity);
        if (isNaN(liftingCapacity) || liftingCapacity < 3500) {
            setErrorMessage('Грузоподъёмность должна быть числом не менее 3500');
            clearErrorMessage();
            return;
        }
        const cargoVolume = parseInt(truckData.cargoVolume);
        if (isNaN(cargoVolume)) {
            setErrorMessage('Объём груза должен быть числом');
            clearErrorMessage();
            return;
        }
        try {
            await createTruck({ ...truckData, liftingCapacity, cargoVolume });
            toggleAddTruck();
            fetchTrucks();
            setErrorMessage(''); // Не показываем сообщение об успехе
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка добавления грузовика');
            clearErrorMessage();
        }
    };

    const handleEditTruckSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!truckData.numberPlate || !truckData.liftingCapacity || !truckData.cargoVolume || !truckData.cargoType) {
            setErrorMessage('Все поля обязательны для заполнения');
            clearErrorMessage();
            return;
        }
        const numberPlatePattern = /^[A-Za-z]{2}\d{5}$/;
        if (!numberPlatePattern.test(truckData.numberPlate)) {
            setErrorMessage('Номер должен быть в формате AB12345');
            clearErrorMessage();
            return;
        }
        const liftingCapacity = parseInt(truckData.liftingCapacity);
        if (isNaN(liftingCapacity) || liftingCapacity < 3500) {
            setErrorMessage('Грузоподъёмность должна быть числом не менее 3500');
            clearErrorMessage();
            return;
        }
        const cargoVolume = parseInt(truckData.cargoVolume);
        if (isNaN(cargoVolume)) {
            setErrorMessage('Объём груза должен быть числом');
            clearErrorMessage();
            return;
        }
        try {
            await updateTruck(selectedTruck.id, { ...truckData, liftingCapacity, cargoVolume });
            toggleEditTruck();
            fetchTrucks();
            setSelectedTruck(null);
            setErrorMessage(''); // Не показываем сообщение об успехе
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка обновления грузовика');
            clearErrorMessage();
        }
    };

    const handleDeleteTruckSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTruck) {
            setErrorMessage('Выберите грузовик для удаления');
            clearErrorMessage();
            return;
        }
        try {
            await deleteTruck(selectedTruck.id);
            toggleDeleteTruck();
            fetchTrucks();
            setSelectedTruck(null);
            setErrorMessage(''); // Не показываем сообщение об успехе
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка удаления грузовика');
            clearErrorMessage();
        }
    };

    const handleEditClientSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!clientData.firstName || !clientData.lastName || !clientData.phoneNumber) {
            setErrorMessage('Все поля обязательны для заполнения');
            clearErrorMessage();
            return;
        }
        const phonePattern = /^\+375(17|25|29|33|44)\d{7}$/;
        if (!phonePattern.test(clientData.phoneNumber)) {
            setErrorMessage('Номер должен быть в формате +375XXXXXXXXX');
            clearErrorMessage();
            return;
        }
        try {
            await updateClient(selectedClient.id, clientData);
            toggleEditClient();
            fetchClients();
            setSelectedClient(null);
            setErrorMessage(''); // Не показываем сообщение об успехе
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка обновления клиента');
            clearErrorMessage();
        }
    };

    const handleDeleteClientSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient) {
            setErrorMessage('Выберите клиента для удаления');
            clearErrorMessage();
            return;
        }
        try {
            await deleteClient(selectedClient.id);
            toggleDeleteClient();
            fetchClients();
            setSelectedClient(null);
            setErrorMessage(''); // Не показываем сообщение об успехе
        } catch (error) {
            setErrorMessage(error.message || 'Ошибка удаления клиента');
            clearErrorMessage();
        }
    };

    const handleLogoClick = () => {
        setView('home');
        setIsMenuOpen(false);
        setSelectedDriver(null);
        setSelectedTruck(null);
        setSelectedClient(null);
        setSelectedOrder(null);
    };

    const handleDriversClick = () => {
        setView('drivers');
        setIsMenuOpen(false);
        setSelectedTruck(null);
        setSelectedClient(null);
        setSelectedOrder(null);
        setErrorMessage(''); // Очищаем сообщение при переходе
    };

    const handleTrucksClick = () => {
        setView('trucks');
        setIsMenuOpen(false);
        setSelectedDriver(null);
        setSelectedClient(null);
        setSelectedOrder(null);
        setErrorMessage(''); // Очищаем сообщение при переходе
    };

    const handleClientsClick = () => {
        setView('clients');
        setIsMenuOpen(false);
        setSelectedDriver(null);
        setSelectedTruck(null);
        setSelectedOrder(null);
        setErrorMessage(''); // Очищаем сообщение при переходе
    };

    const handleOrdersClick = () => {
        if (!loggedInClient) {
            toggleLogin();
            return;
        }
        setView('orders');
        setIsMenuOpen(false);
        setSelectedDriver(null);
        setSelectedTruck(null);
        setSelectedClient(null);
        setErrorMessage(''); // Очищаем сообщение при переходе
    };

    const handleDriverSelect = (driver) => {
        setSelectedDriver(driver);
        setSelectedTruck(null);
        setSelectedClient(null);
        setSelectedOrder(null);
    };

    const handleTruckSelect = (truck) => {
        setSelectedTruck(truck);
        setSelectedDriver(null);
        setSelectedClient(null);
        setSelectedOrder(null);
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setSelectedDriver(null);
        setSelectedTruck(null);
        setSelectedOrder(null);
    };

    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
        setSelectedDriver(null);
        setSelectedTruck(null);
        setSelectedClient(null);
    };

    return (
        <div className="home-page">
            {(showLogin || showRegister || showAddOrder || showAddDriver || showEditDriver || showDeleteDriver || showAddTruck || showEditTruck || showDeleteTruck || showEditClient || showDeleteClient || showEditOrder || showDeleteOrder) && <div className="modal-overlay" />}
            <div className="container">
                <header className={`header ${isMenuOpen ? 'header-open' : 'header-closed'}`}>
                    <span className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>TransportLogistics</span>
                    <div className="header-right">
                        {loggedInClient ? (
                            <>
                                <span className="user-info">
                                    {`${loggedInClient.firstName} ${loggedInClient.lastName}`}
                                </span>
                                <button className="logout-btn" onClick={handleLogout}>Выход</button>
                            </>
                        ) : (
                            <button className="login-btn" onClick={toggleLogin}>Вход</button>
                        )}
                        <div className="menu-icon" onClick={toggleMenu}>
                            {isMenuOpen ? '✖' : '☰'}
                        </div>
                    </div>
                    <div className={`menu-panel ${isMenuOpen ? 'menu-panel-open' : 'menu-panel-closed'}`}>
                        <div className="menu-panel-content">
                            <button className="menu-btn" onClick={handleOrdersClick}>Заказы</button>
                            <button className="menu-btn" onClick={handleClientsClick}>Клиенты</button>
                            <button className="menu-btn" onClick={handleDriversClick}>Водители</button>
                            <button className="menu-btn" onClick={handleTrucksClick}>Автомобили</button>
                        </div>
                    </div>
                </header>

                <div className={`modal ${showLogin ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Вход</h2>
                                <button type="button" className="close-btn" onClick={toggleLogin}>✖</button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <input
                                    type="text"
                                    name="login"
                                    placeholder="Логин"
                                    value={loginData.login}
                                    onChange={handleLoginChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Пароль"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className="form-control"
                                    required
                                />
                                <button className="modal-btn" onClick={handleLoginSubmit}>Войти</button>
                                <button className="modal-btn" onClick={toggleRegister}>Регистрация</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showRegister ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Регистрация</h2>
                                <button type="button" className="close-btn" onClick={toggleRegister}>✖</button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Имя"
                                    value={registerData.firstName}
                                    onChange={handleRegisterChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Фамилия"
                                    value={registerData.lastName}
                                    onChange={handleRegisterChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Номер телефона (+375XXXXXXXXX)"
                                    value={registerData.phoneNumber}
                                    onChange={handleRegisterChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="login"
                                    placeholder="Логин"
                                    value={registerData.login}
                                    onChange={handleRegisterChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Пароль"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    className="form-control"
                                    required
                                />
                                <button className="modal-btn" onClick={handleRegisterSubmit}>Зарегистрироваться</button>
                                <button className="modal-btn" onClick={toggleLogin}>Вход</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showAddOrder ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Оформить заказ</h2>
                                <button type="button" className="close-btn" onClick={toggleAddOrder}>✖</button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <input
                                    type="text"
                                    name="loadingPoint"
                                    placeholder="Место загрузки"
                                    value={orderData.loadingPoint}
                                    onChange={handleOrderChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="deliveryPoint"
                                    placeholder="Место доставки"
                                    value={orderData.deliveryPoint}
                                    onChange={handleOrderChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="clientId"
                                    placeholder="ID клиента"
                                    value={loggedInClient ? `${loggedInClient.firstName} ${loggedInClient.lastName}` : 'Необходимо войти'}
                                    className="form-control"
                                    disabled
                                />
                                <select
                                    name="driverId"
                                    value={orderData.driverId}
                                    onChange={handleOrderChange}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Выберите водителя</option>
                                    {drivers.map(driver => (
                                        <option key={driver.id} value={driver.id}>
                                            {`${driver.firstName} ${driver.lastName} (Стаж: ${driver.workExperience} лет)`}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="truckId"
                                    value={orderData.truckId}
                                    onChange={handleOrderChange}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Выберите грузовик</option>
                                    {trucks.map(truck => (
                                        <option key={truck.id} value={truck.id}>
                                            {`${truck.numberPlate} (Грузоподъёмность: ${truck.liftingCapacity} кг, Объём: ${truck.cargoVolume} м³, Тип: ${truck.cargoType})`}
                                        </option>
                                    ))}
                                </select>
                                <button className="modal-btn" onClick={handleAddOrderSubmit}>Оформить</button>
                                <button className="modal-btn" onClick={toggleAddOrder}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showEditOrder ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Изменить заказ</h2>
                                <button type="button" className="close-btn" onClick={() => toggleEditOrder(null)}>✖</button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <input
                                    type="text"
                                    name="loadingPoint"
                                    placeholder="Место загрузки"
                                    value={orderData.loadingPoint}
                                    onChange={handleOrderChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="deliveryPoint"
                                    placeholder="Место доставки"
                                    value={orderData.deliveryPoint}
                                    onChange={handleOrderChange}
                                    className="form-control"
                                    required
                                />
                                <select
                                    name="driverId"
                                    value={orderData.driverId}
                                    onChange={handleOrderChange}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Выберите водителя</option>
                                    {drivers.map(driver => (
                                        <option key={driver.id} value={driver.id}>
                                            {`${driver.firstName} ${driver.lastName} (Стаж: ${driver.workExperience} лет)`}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="truckId"
                                    value={orderData.truckId}
                                    onChange={handleOrderChange}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Выберите грузовик</option>
                                    {trucks.map(truck => (
                                        <option key={truck.id} value={truck.id}>
                                            {`${truck.numberPlate} (Грузоподъёмность: ${truck.liftingCapacity} кг)`}
                                        </option>
                                    ))}
                                </select>
                                <button className="modal-btn" onClick={handleEditOrderSubmit}>Сохранить</button>
                                <button className="modal-btn" onClick={() => toggleEditOrder(null)}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showDeleteOrder ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Удалить заказ</h2>
                                <button type="button" className="close-btn" onClick={() => toggleDeleteOrder(null)}>✖</button>
                            </div>
                            <div className="modal-body">
                                <p>Вы уверены, что хотите удалить заказ #{selectedOrder?.id}?</p>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <button className="modal-btn" onClick={handleDeleteOrderSubmit}>Удалить</button>
                                <button className="modal-btn" onClick={() => toggleDeleteOrder(null)}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showAddDriver ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Добавить водителя</h2>
                                <button type="button" className="close-btn" onClick={toggleAddDriver}>✖</button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Имя"
                                    value={driverData.firstName}
                                    onChange={handleDriverChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Фамилия"
                                    value={driverData.lastName}
                                    onChange={handleDriverChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Номер телефона (+375XXXXXXXXX)"
                                    value={driverData.phoneNumber}
                                    onChange={handleDriverChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="workExperience"
                                    placeholder="Стаж работы (годы)"
                                    value={driverData.workExperience}
                                    onChange={handleDriverChange}
                                    className="form-control"
                                    required
                                />
                                <button className="modal-btn" onClick={handleAddDriverSubmit}>Добавить</button>
                                <button className="modal-btn" onClick={toggleAddDriver}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showEditDriver ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Изменить водителя</h2>
                                <button type="button" className="close-btn" onClick={toggleEditDriver}>✖</button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Имя"
                                    value={driverData.firstName}
                                    onChange={handleDriverChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Фамилия"
                                    value={driverData.lastName}
                                    onChange={handleDriverChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Номер телефона (+375XXXXXXXXX)"
                                    value={driverData.phoneNumber}
                                    onChange={handleDriverChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="workExperience"
                                    placeholder="Стаж работы (годы)"
                                    value={driverData.workExperience}
                                    onChange={handleDriverChange}
                                    className="form-control"
                                    required
                                />
                                <button className="modal-btn" onClick={handleEditDriverSubmit}>Сохранить</button>
                                <button className="modal-btn" onClick={toggleEditDriver}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showDeleteDriver ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Удалить водителя</h2>
                                <button type="button" className="close-btn" onClick={toggleDeleteDriver}>✖</button>
                            </div>
                            <div className="modal-body">
                                <p>Вы уверены, что хотите удалить водителя?</p>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <button className="modal-btn" onClick={handleDeleteDriverSubmit}>Удалить</button>
                                <button className="modal-btn" onClick={toggleDeleteDriver}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showAddTruck ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Добавить грузовик</h2>
                                <button type="button" className="close-btn" onClick={toggleAddTruck}>✖</button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <input
                                    type="text"
                                    name="numberPlate"
                                    placeholder="Номер (AB12345)"
                                    value={truckData.numberPlate}
                                    onChange={handleTruckChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="liftingCapacity"
                                    placeholder="Грузоподъёмность (≥3500 кг)"
                                    value={truckData.liftingCapacity}
                                    onChange={handleTruckChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="cargoVolume"
                                    placeholder="Объём груза (м³)"
                                    value={truckData.cargoVolume}
                                    onChange={handleTruckChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="cargoType"
                                    placeholder="Тип груза"
                                    value={truckData.cargoType}
                                    onChange={handleTruckChange}
                                    className="form-control"
                                    required
                                />
                                <button className="modal-btn" onClick={handleAddTruckSubmit}>Добавить</button>
                                <button className="modal-btn" onClick={toggleAddTruck}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showEditTruck ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Изменить грузовик</h2>
                                <button type="button" className="close-btn" onClick={toggleEditTruck}>✖</button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <input
                                    type="text"
                                    name="numberPlate"
                                    placeholder="Номер (AB12345)"
                                    value={truckData.numberPlate}
                                    onChange={handleTruckChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="liftingCapacity"
                                    placeholder="Грузоподъёмность (≥3500 кг)"
                                    value={truckData.liftingCapacity}
                                    onChange={handleTruckChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="cargoVolume"
                                    placeholder="Объём груза (м³)"
                                    value={truckData.cargoVolume}
                                    onChange={handleTruckChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="cargoType"
                                    placeholder="Тип груза"
                                    value={truckData.cargoType}
                                    onChange={handleTruckChange}
                                    className="form-control"
                                    required
                                />
                                <button className="modal-btn" onClick={handleEditTruckSubmit}>Сохранить</button>
                                <button className="modal-btn" onClick={toggleEditTruck}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showDeleteTruck ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Удалить грузовик</h2>
                                <button type="button" className="close-btn" onClick={toggleDeleteTruck}>✖</button>
                            </div>
                            <div className="modal-body">
                                <p>Вы уверены, что хотите удалить грузовик?</p>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <button className="modal-btn" onClick={handleDeleteTruckSubmit}>Удалить</button>
                                <button className="modal-btn" onClick={toggleDeleteTruck}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showEditClient ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Изменить клиента</h2>
                                <button type="button" className="close-btn" onClick={toggleEditClient}>✖</button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Имя"
                                    value={clientData.firstName}
                                    onChange={handleClientChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Фамилия"
                                    value={clientData.lastName}
                                    onChange={handleClientChange}
                                    className="form-control"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Номер телефона (+375XXXXXXXXX)"
                                    value={clientData.phoneNumber}
                                    onChange={handleClientChange}
                                    className="form-control"
                                    required
                                />
                                <button className="modal-btn" onClick={handleEditClientSubmit}>Сохранить</button>
                                <button className="modal-btn" onClick={toggleEditClient}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${showDeleteClient ? 'd-block' : 'd-none'}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Удалить клиента</h2>
                                <button type="button" className="close-btn" onClick={toggleDeleteClient}>✖</button>
                            </div>
                            <div className="modal-body">
                                <p>Вы уверены, что хотите удалить клиента?</p>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <button className="modal-btn" onClick={handleDeleteClientSubmit}>Удалить</button>
                                <button className="modal-btn" onClick={toggleDeleteClient}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>

                {view === 'home' ? (
                    <>
                        <main className="main-content">
                            <div className="text-section">
                                <p className="delivery-type">Доставка > Грузоперевозки</p>
                                <h1>Грузовая доставка <br /> по городу</h1>
                                <button className="create-order-btn" onClick={toggleAddOrder}>Оформить заказ →</button>
                            </div>
                            <div className="image-section">
                                <img src={homepageImage} alt="Грузовик" className="truck-image" />
                            </div>
                        </main>
                        <section className="info-section">
                            <div className="order-path">
                                <div className="order-step">
                                    <img src={orderIcon} alt="Прием заказа" className="step-icon" />
                                    <span>прием заказа</span>
                                </div>
                                <span className="step-arrow">→</span>
                                <div className="order-step">
                                    <img src={loadingIcon} alt="Прибытие и загрузка" className="step-icon" />
                                    <span>загрузка в вашем месте</span>
                                </div>
                                <span className="step-arrow">→</span>
                                <div className="order-step">
                                    <img src={deliveryIcon} alt="Доставка" className="step-icon" />
                                    <span>доставка до указанного места</span>
                                </div>
                                <span className="step-arrow">→</span>
                                <div className="order-step">
                                    <img src={unloadingIcon} alt="Разгрузка" className="step-icon" />
                                    <span>разгрузка</span>
                                </div>
                            </div>
                        </section>
                    </>
                ) : view === 'drivers' ? (
                    <section className="drivers-section">
                        <h2>Водители</h2>
                        {/* Убираем отображение errorMessage */}
                        <table className="drivers-table">
                            <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>Телефон</th>
                                <th>Стаж (годы)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {drivers.map(driver => (
                                <tr
                                    key={driver.id}
                                    className={selectedDriver && selectedDriver.id === driver.id ? 'selected' : ''}
                                    onClick={() => handleDriverSelect(driver)}
                                >
                                    <td>{driver.firstName}</td>
                                    <td>{driver.lastName}</td>
                                    <td>{driver.phoneNumber}</td>
                                    <td>{driver.workExperience}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="drivers-actions">
                            <button className="modal-btn" onClick={toggleAddDriver}>Добавить водителя</button>
                            <div className="action-buttons">
                                <button
                                    className="modal-btn"
                                    onClick={toggleEditDriver}
                                    disabled={!selectedDriver}
                                >
                                    Изменить водителя
                                </button>
                                <button
                                    className="modal-btn"
                                    onClick={toggleDeleteDriver}
                                    disabled={!selectedDriver}
                                >
                                    Удалить водителя
                                </button>
                            </div>
                        </div>
                    </section>
                ) : view === 'trucks' ? (
                    <section className="trucks-section">
                        <h2>Грузовики</h2>
                        {/* Убираем отображение errorMessage */}
                        <table className="trucks-table">
                            <thead>
                            <tr>
                                <th>Номер</th>
                                <th>Грузоподъёмность (кг)</th>
                                <th>Объём груза (м³)</th>
                                <th>Тип груза</th>
                            </tr>
                            </thead>
                            <tbody>
                            {trucks.map(truck => (
                                <tr
                                    key={truck.id}
                                    className={selectedTruck && selectedTruck.id === truck.id ? 'selected' : ''}
                                    onClick={() => handleTruckSelect(truck)}
                                >
                                    <td>{truck.numberPlate}</td>
                                    <td>{truck.liftingCapacity}</td>
                                    <td>{truck.cargoVolume}</td>
                                    <td>{truck.cargoType}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="trucks-actions">
                            <button className="modal-btn" onClick={toggleAddTruck}>Добавить грузовик</button>
                            <div className="action-buttons">
                                <button
                                    className="modal-btn"
                                    onClick={toggleEditTruck}
                                    disabled={!selectedTruck}
                                >
                                    Изменить грузовик
                                </button>
                                <button
                                    className="modal-btn"
                                    onClick={toggleDeleteTruck}
                                    disabled={!selectedTruck}
                                >
                                    Удалить грузовик
                                </button>
                            </div>
                        </div>
                    </section>
                ) : view === 'clients' ? (
                    <section className="clients-section">
                        <h2>Клиенты</h2>
                        {/* Убираем отображение errorMessage */}
                        <table className="clients-table">
                            <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>Телефон</th>
                                <th>Логин</th>
                                <th>Пароль</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clients.map(client => (
                                <tr
                                    key={client.id}
                                    className={selectedClient && selectedClient.id === client.id ? 'selected' : ''}
                                    onClick={() => handleClientSelect(client)}
                                >
                                    <td>{client.firstName}</td>
                                    <td>{client.lastName}</td>
                                    <td>{client.phoneNumber}</td>
                                    <td>{client.login}</td>
                                    <td>{client.password}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="clients-actions">
                            <div className="action-buttons">
                                <button
                                    className="modal-btn"
                                    onClick={toggleEditClient}
                                    disabled={!selectedClient}
                                >
                                    Изменить клиента
                                </button>
                                <button
                                    className="modal-btn"
                                    onClick={toggleDeleteClient}
                                    disabled={!selectedClient}
                                >
                                    Удалить клиента
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="orders-section">
                        <h2>Заказы</h2>
                        <div className="orders-list" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            {orders.length > 0 ? (
                                orders.map(order => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        onSelect={() => handleOrderSelect(order)}
                                        onEdit={() => toggleEditOrder(order)}
                                        onDelete={() => toggleDeleteOrder(order)}
                                        isSelected={selectedOrder && selectedOrder.id === order.id}
                                    />
                                ))
                            ) : (
                                <p>Заказы отсутствуют.</p>
                            )}
                        </div>
                    </section>
                )}
            </div>
            {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </div>
    );
}

const OrderCard = ({ order, onSelect, onEdit, onDelete, isSelected }) => {
    return (
        <div className={`order-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
            <h3>Заказ #{order.id}</h3>
            <div className="order-details">
                <p><strong>Дата:</strong> {new Date(order.orderDate).toLocaleDateString('ru-RU')}</p>
                <p><strong>Маршрут:</strong> {order.loadingPoint} → {order.deliveryPoint}</p>
            </div>
            <div className="client-details">
                <h4>Клиент</h4>
                <p><strong>Имя:</strong> {order.client.firstName} {order.client.lastName}</p>
                <p><strong>Телефон:</strong> {order.client.phoneNumber}</p>
            </div>
            <div className="driver-details">
                <h4>Водитель</h4>
                <p><strong>Имя:</strong> {order.driver.firstName} {order.driver.lastName}</p>
                <p><strong>Телефон:</strong> {order.driver.phoneNumber}</p>
            </div>
            <div className="truck-details">
                <h4>Автомобиль</h4>
                <p><strong>Номер:</strong> {order.truck.numberPlate}</p>
                <p><strong>Грузоподъемность:</strong> {order.truck.liftingCapacity} кг</p>
                <p><strong>Объём груза:</strong> {order.truck.cargoVolume} м³</p>
                <p><strong>Тип груза:</strong> {order.truck.cargoType}</p>
            </div>
            <div className="card-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '10px 0' }}>
                <button className="modal-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }}>Изменить</button>
                <button className="modal-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>Удалить</button>
            </div>
        </div>
    );
};

export default HomePage;