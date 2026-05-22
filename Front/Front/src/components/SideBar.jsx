import React from 'react';

export const SideBar = ({ currentTab, setCurrentTab, onLogout, role }) => {
  const userRole = (role || 'USER').toUpperCase();
  const isAdmin = userRole === 'ADMIN';
  const isAdminOrGestor = userRole === 'ADMIN' || userRole === 'GESTOR';

  return (
    <div className="sidebar-adaptable d-flex flex-column p-4 justify-content-between bg-white border-end border-light-subtle">
      <div>
        {/* Logo superior */}
        <div className="d-flex align-items-center mb-5 px-2">
          <img src="/logo.png" alt="FocoList" style={{ width: '45px', height: '45px', objectFit: 'contain' }} className="me-3" />
          <div>
            <h4 className="fw-bold m-0 text-dark">FocoList</h4>
            <span className="text-muted small fw-semibold" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>PROFESSIONAL</span>
          </div>
        </div>

        {/* Menú de Opciones */}
        <div className="nav flex-column gap-3">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`nav-link text-start border-0 py-3 px-4 d-flex align-items-center rounded-4 fw-semibold transition-all ${currentTab === 'dashboard' ? 'btn-neumorphic-primary text-primary' : 'text-muted bg-transparent'}`}
          >
            <i className="bi bi-speedometer2 fs-5 me-3"></i> Dashboard
          </button>

          <button
            onClick={() => setCurrentTab('tasks')}
            className={`nav-link text-start border-0 py-3 px-4 d-flex align-items-center rounded-4 fw-semibold transition-all ${currentTab === 'tasks' ? 'btn-neumorphic-primary text-primary' : 'text-muted bg-transparent'}`}
          >
            <i className="bi bi-list-task fs-5 me-3"></i> Tareas
          </button>

          {isAdminOrGestor && (
            <>
              <button
                onClick={() => setCurrentTab('categories')}
                className={`nav-link text-start border-0 py-3 px-4 d-flex align-items-center rounded-4 fw-semibold transition-all ${currentTab === 'categories' ? 'btn-neumorphic-primary text-primary' : 'text-muted bg-transparent'}`}
              >
                <i className="bi bi-folder fs-5 me-3"></i> Categorías
              </button>

              <button
                onClick={() => setCurrentTab('tags')}
                className={`nav-link text-start border-0 py-3 px-4 d-flex align-items-center rounded-4 fw-semibold transition-all ${currentTab === 'tags' ? 'btn-neumorphic-primary text-primary' : 'text-muted bg-transparent'}`}
              >
                <i className="bi bi-tag fs-5 me-3"></i> Etiquetas
              </button>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => setCurrentTab('users')}
              className={`nav-link text-start border-0 py-3 px-4 d-flex align-items-center rounded-4 fw-semibold transition-all ${currentTab === 'users' ? 'btn-neumorphic-primary text-primary' : 'text-muted bg-transparent'}`}
            >
              <i className="bi bi-people fs-5 me-3"></i> Usuarios
            </button>
          )}

          <button
            onClick={() => setCurrentTab('profile')}
            className={`nav-link text-start border-0 py-3 px-4 d-flex align-items-center rounded-4 fw-semibold transition-all ${currentTab === 'profile' ? 'btn-neumorphic-primary text-primary' : 'text-muted bg-transparent'}`}
          >
            <i className="bi bi-person fs-5 me-3"></i> Perfil
          </button>
        </div>
      </div>

      {/* Acciones de Cuenta */}
      <div className="px-2 pt-3 border-top border-light-subtle d-flex flex-column mt-5">
        <button
          onClick={onLogout}
          className="btn btn-link text-danger text-decoration-none text-start p-2 small fw-semibold d-flex align-items-center gap-2"
        >
          <i className="bi bi-box-arrow-left fs-5"></i> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};