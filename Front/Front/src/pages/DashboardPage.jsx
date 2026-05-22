import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SideBar } from '../components/SideBar';
import { TaskList } from '../components/TaskList';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { CategoryList } from '../components/CategoryList';
import { TagList } from '../components/TagList';
import { ProfileView } from '../components/ProfileView';
import { UsersListView } from '../components/UsersListView';
import { DashboardView } from '../components/DashboardView';

export const DashboardPage = ({ currentTab, setCurrentTab }) => {
    const { logout } = useContext(AuthContext);
    const [editingTask, setEditingTask] = useState(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileRef = useRef(null);

    const savedData = JSON.parse(localStorage.getItem('user_data')) || {};
    const userData = {
        username: savedData.userName || savedData.username || 'user',
        email: savedData.email || '',
        role: savedData.role || savedData.rol || 'USER'
    };

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderContent = () => {
        switch (currentTab) {
            case 'dashboard': return <DashboardView onNavigate={setCurrentTab} />;
            case 'tasks': return <TaskList role={userData.role} onEditTask={(task) => { setEditingTask(task); setCurrentTab('create-task'); }} />;
            case 'create-task': return <CreateTaskForm editingTask={editingTask} onCancelEdit={() => { setEditingTask(null); setCurrentTab('tasks'); }} onTaskCreated={() => setCurrentTab('tasks')} />;
            case 'categories': return <CategoryList />;
            case 'tags': return <TagList />;
            case 'users': return <UsersListView />;
            case 'profile': return <ProfileView userData={userData} onProfileUpdated={() => { }} />;
            default: return <DashboardView />;
        }
    };

    return (
        <div className="d-flex flex-column flex-lg-row w-100 bg-light min-vh-100 text-dark">

            {/* Barra Lateral */}
            <SideBar
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                onLogout={handleLogout}
                role={userData.role}
            />

            {/* Contenedor derecho del contenido */}
            <div className="d-flex flex-column flex-grow-1 style-panel-derecho">

                {/* Header Superior */}
                <div className="bg-white border-bottom border-light-subtle py-3 px-4 d-flex justify-content-between align-items-center flex-shrink-0">
                    <div>
                        <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>Panel de Control</span>
                        <h5 className="fw-bold m-0 text-dark text-capitalize">{currentTab.replace('-', ' ')}</h5>
                    </div>

                    {/* Perfil Dropdown */}
                    <div className="d-flex align-items-center gap-3">
                        <div className="position-relative" ref={profileRef}>
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="btn bg-white border border-light-subtle d-flex align-items-center gap-2 py-1.5 px-3 rounded-3 shadow-sm"
                            >
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold small" style={{ width: '32px', height: '32px' }}>
                                    {userData.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-start d-none d-sm-block">
                                    <p className="m-0 small fw-bold text-dark lh-1">{userData.username}</p>
                                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>{userData.role}</span>
                                </div>
                                <i className="bi bi-chevron-down text-muted small ms-1"></i>
                            </button>

                            {profileDropdownOpen && (
                                <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border border-light-subtle py-2" style={{ width: '240px', zIndex: 1050 }}>
                                    <div className="p-2 px-3">
                                        <h6 className="fw-bold mb-0 text-dark small">{userData.username}</h6>
                                        <span className="text-muted small d-block text-truncate" style={{ fontSize: '0.75rem' }}>{userData.email}</span>
                                    </div>
                                    <hr className="my-1.5 text-muted opacity-25" />
                                    <button onClick={() => { setCurrentTab('profile'); setProfileDropdownOpen(false); }} className="dropdown-item rounded-2 py-2 text-secondary fw-semibold small">
                                        <i className="bi bi-person me-2"></i> Mi Perfil
                                    </button>
                                    <hr className="my-1.5 text-muted opacity-25" />
                                    <button onClick={handleLogout} className="dropdown-item rounded-2 py-2 text-danger fw-semibold small">
                                        <i className="bi bi-box-arrow-left me-2"></i> Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* VISTA DINÁMICA ACTIVA */}
                <div className="flex-grow-1 p-3 p-md-5 d-flex flex-column justify-content-start align-items-stretch">
                    {renderContent()}
                </div>

            </div>
        </div>
    );
};