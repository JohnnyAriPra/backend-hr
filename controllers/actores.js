const { Pool } = require('pg');

const pool = new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: 'utm123',
    database: 'hr',
    port: 5432
});

//endpoint para obtener todos los actores
async function getActores(req, res) {
    try {
        const client = await pool.connect();
        const result = await pool.query('SELECT * FROM employees');
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los employees' });
    }
}

//endpoint para obtener actor por ID
async function getActorById(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM employees WHERE employee_id = $1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json(result.rows);
        } else {
            res.status(400).json({ error: 'No se encontró el employee' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener employee' });
    }
}

//endpoint para ingresar un actor
async function createActor(req, res) {
    const { employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;

    // Validar y convertir fechas
    const formattedHireDate = hire_date ? new Date(hire_date) : null;


    const query = `
    INSERT INTO employees (employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
    returning *`;
    const values = [employee_id, first_name, last_name, email, phone_number, formattedHireDate, job_id, salary, commission_pct, manager_id, department_id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        res.status(201).json({
            message: 'Employee ingresado correctamente',
            actor: result.rows
        });
    } catch (error) {
        console.error('Error al crear el employee:', error);
        res.status(500).json({ error: 'Error al crear el employee' });
    }
}


//endpoint para actualizar un actor
async function updateActor(req, res) {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;

    // Validar y convertir fechas
    const formattedHireDate = hire_date ? new Date(hire_date) : null;


    const query = `
    UPDATE employees SET first_name = $1, last_name = $2, email = $3, phone_number = $4, hire_date = $5, job_id = $6, 
    salary = $7, commission_pct = $8, manager_id = $9, department_id = $10 
    WHERE employee_id = $11 returning *`;
    const values = [first_name, last_name, email, phone_number, formattedHireDate, job_id, salary, commission_pct, manager_id, department_id, id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.json({
                message: 'Employee actualizado correctamente',
                actor: result.rows
            });
        } else {
            res.status(400).json({ error: 'No se encontró el employee' });
        }
    } catch (error) {
        console.error('Error al actualizar employee:', error);
        res.status(500).json({ error: 'Error al actualizar employee' });
    }
}


//endpoint para eliminar un actor
async function deleteActor(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM employees WHERE employee_id  = $1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json({ message: 'Employee eliminado correctamente' });
        } else {
            res.status(400).json({ error: 'No se encontró el employee' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar employee' });
    }
}

module.exports = {
    getActores,
    getActorById,
    createActor,
    updateActor,
    deleteActor
}