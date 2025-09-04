// app.get('/api/incomes', async (req, res) => {
//   const { startDate, endDate, limit = 10, page = 1 } = req.query;

//   try {
//     let query = `
//       SELECT id, amount, currency, date, description 
//       FROM transactions 
//       WHERE type = 'income'
//     `;
//     const params: any[] = [];

//     if (startDate && endDate) {
//       query += ` AND date BETWEEN $1 AND $2`;
//       params.push(startDate, endDate);
//     }

//     const offset = (Number(page) - 1) * Number(limit);
//     query += ` ORDER BY date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
//     params.push(Number(limit), offset);

//     const result = await db.query(query, params);

//     // Опціонально: загальна кількість для пагінації
//     const countQuery =
//       `SELECT COUNT(*) FROM transactions WHERE type = 'income'` +
//       (startDate && endDate ? ` AND date BETWEEN $1 AND $2` : '');
//     const countParams = startDate && endDate ? [startDate, endDate] : [];
//     const countResult = await db.query(countQuery, countParams);
//     const total = parseInt(countResult.rows[0].count);

//     res.json({ data: result.rows, total });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// app.get('/api/expenses', async (req, res) => {
//   const { startDate, endDate, limit = 10, page = 1 } = req.query;

//   try {
//     let query = `
//       SELECT id, amount, currency, date, description 
//       FROM transactions 
//       WHERE type = 'expense'
//     `;
//     const params: any[] = [];

//     if (startDate && endDate) {
//       query += ` AND date BETWEEN $1 AND $2`;
//       params.push(startDate, endDate);
//     }

//     const offset = (Number(page) - 1) * Number(limit);
//     query += ` ORDER BY date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
//     params.push(Number(limit), offset);

//     const result = await db.query(query, params);

//     // Опціонально: загальна кількість для пагінації
//     const countQuery =
//       `SELECT COUNT(*) FROM transactions WHERE type = 'income'` +
//       (startDate && endDate ? ` AND date BETWEEN $1 AND $2` : '');
//     const countParams = startDate && endDate ? [startDate, endDate] : [];
//     const countResult = await db.query(countQuery, countParams);
//     const total = parseInt(countResult.rows[0].count);

//     res.json({ data: result.rows, total });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // GET /api/currency-rates?date=YYYY-MM-DD
// app.get('/api/currency-rates', async (req, res) => {
//   const { date } = req.query;
//   if (!date) {
//     return res.status(400).json({ error: 'Missing date query param' });
//   }
//   try {
//     // Пошук курсу за конкретну дату
//     const result = await db.query(
//       `SELECT usd_to_uah, eur_to_uah FROM currency_rates WHERE date = $1`,
//       [date],
//     );

//     if (result.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ error: 'Currency rates not found for this date' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// const fakeInsertIncomes = async () => {
//   const date = new Date().toISOString().split('T')[0];

//   const result = await db.query(
//     `INSERT INTO transactions(type, amount, currency, date)
//      VALUES($1, $2, $3, $4)`,
//     ['expense', 478, 'USD', date],
//   );


// };

// app.get('/api/lol', async (req, res) => {
//   let conn = await getConnection();
//   try {
//     const result = await conn.execute(`SELECT a.DOVINFO FROM OS a`);

//     if (result.rows && result.rows.length > 0) {
//       res.json(result.rows);
//     } else {
//       res.status(404).json({ error: 'No data found' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//     if (conn) {
//       try {
//         await conn.close();
//       } catch (closeErr) {
//         console.error(closeErr);
//       }
//     }
//   }
// });
// // app.get('/api/menus', async (req, res) => {
// //   const userId = Number(req.query.user_id) || 5;

// //   try {
// //     const result = await pool.query(
// //       `
// //       WITH RECURSIVE menu_tree AS (
// //         SELECT
// //           m.id,
// //           m.title,
// //           m.parent_id,
// //           m.url,
// //           m."order",
// //           m.icon
// //         FROM menus m
// //         INNER JOIN menu_permissions mp ON mp.menu_id = m.id
// //         WHERE
// //           (mp.user_id = $1 OR mp.user_id IS NULL)

// //         UNION ALL

// //         SELECT
// //           m2.id,
// //           m2.title,
// //           m2.parent_id,
// //           m2.url,
// //           m2."order",
// //           m2.icon
// //         FROM menus m2
// //         INNER JOIN menu_tree mt ON mt.id = m2.parent_id
// //         INNER JOIN menu_permissions mp ON mp.menu_id = m2.id
// //         WHERE
// //           (mp.user_id = $1 OR mp.user_id IS NULL)

// //       )
// //       SELECT DISTINCT * FROM menu_tree
// //       ORDER BY parent_id NULLS FIRST, "order";
// //       `,
// //       [userId],
// //     );

// //     res.json(result.rows);
// //   } catch (err) {
// //     console.error('Error fetching menu:', err);
// //     res.status(500).json({ error: 'Failed to fetch menu' });
// //   }
// // });

// app.get('/api/menus', async (req, res) => {
//   try {
//     const result = await pool.query(
//       `
//       WITH RECURSIVE menu_tree AS (
//         SELECT
//           m.id,
//           m.title,
//           m.parent_id,
//           m.url,
//           m."order",
//           m.icon
//         FROM menus m
//         WHERE m.parent_id IS NULL

//         UNION ALL

//         SELECT
//           m2.id,
//           m2.title,
//           m2.parent_id,
//           m2.url,
//           m2."order",
//           m2.icon
//         FROM menus m2
//         INNER JOIN menu_tree mt ON mt.id = m2.parent_id
//       )
//       SELECT DISTINCT * FROM menu_tree
//       ORDER BY parent_id NULLS FIRST, "order";
//       `,
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching menu:', err);
//     res.status(500).json({ error: 'Failed to fetch menu' });
//   }
// });

// app.get('/api/menu-permissions', async (req, res) => {
//   const userId = Number(req.query.user_id);

//   try {
//     const result = await pool.query(
//       `
//       SELECT 
//         m.id,
//         m.title,
//         m.parent_id,
//         m.url,
//         m."order",
//         m.icon,
//         CASE 
//           WHEN mp.user_id IS NOT NULL THEN true 
//           ELSE false 
//         END AS has_access
//       FROM menus m
//       LEFT JOIN menu_permissions mp 
//         ON mp.menu_id = m.id AND mp.user_id = $1
//       ORDER BY m.parent_id NULLS FIRST, m."order";
//       `,
//       [userId],
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching menu with permissions:', err);
//     res.status(500).json({ error: 'Failed to fetch menu with permissions' });
//   }
// });
// // app.post('/api/toggle_menu_permissions', async (req, res) => {
// //   const { user_id, menu_id, allow } = req.body;

// //   if (!user_id || !menu_id) {
// //     return res.status(400).json({ error: 'menuId і userId обов’язкові' });
// //   }

// //   try {
// //     if (allow) {
// //       await pool.query(
// //         `INSERT INTO menu_permissions (menu_id, user_id)
// //          VALUES ($1, $2)
// //          ON CONFLICT DO NOTHING`,
// //         [menu_id, user_id]
// //       );
// //     } else {
// //       await pool.query(
// //         `DELETE FROM menu_permissions
// //          WHERE menu_id = $1 AND user_id = $2`,
// //         [menu_id, user_id]
// //       );
// //     }

// //     res.json({ success: true });
// //   } catch (err) {
// //     console.error('Error toggling menu access', err);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// app.post('/api/toggle_menu_permissions', async (req, res) => {
//   const { menu_id, user_id, allow } = req.body;

//   try {
//     if (allow) {
//       await pool.query(
//         `INSERT INTO menu_permissions (menu_id, user_id)
//          VALUES ($1, $2)
//          ON CONFLICT DO NOTHING`,
//         [menu_id, user_id],
//       );
//     } else {
//       // Отримати всі дочірні menu_id
//       const childMenusRes = await pool.query(
//         `WITH RECURSIVE all_children AS (
//           SELECT id FROM menus WHERE id = $1
//           UNION ALL
//           SELECT m.id FROM menus m
//           INNER JOIN all_children ac ON m.parent_id = ac.id
//         )
//         SELECT id FROM all_children`,
//         [menu_id],
//       );

//       const allMenuIds = childMenusRes.rows.map((row) => row.id);

//       // Видалити права доступу для всіх пунктів (головного + дочірніх)
//       await pool.query(
//         `DELETE FROM menu_permissions
//          WHERE user_id = $1 AND menu_id = ANY($2::int[])`,
//         [user_id, allMenuIds],
//       );
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error('Error toggling menu access', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT id, name,user_id FROM users ORDER BY name',
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Не вдалося отримати користувачів' });
//   }
// });
