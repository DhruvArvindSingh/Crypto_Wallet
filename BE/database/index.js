import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { CLIENT_LINK } = process.env;
const { Client } = pkg;
let client;
try {
        client = await new Client(`${CLIENT_LINK}`);
}
catch (e) {
        console.log("Unable to connect to database");
        console.log(e);
}
await client.connect();
await client.query(`CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`);
// await client.query(`CREATE TABLE IF NOT EXISTS personal_details(
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER UNIQUE NOT NULL,
//     first_name VARCHAR(200),
//     middle_name VARCHAR(200),
//     last_name VARCHAR(200),
//     gender VARCHAR(200),
//     date_of_birth VARCHAR(200),
//     age VARCHAR(200),
//     marital_status VARCHAR(200),
//     phone_no_1 VARCHAR(200),
//     phone_no_2 VARCHAR(200),
//     qualification VARCHAR(200),
//     home_address_1 VARCHAR(1000),
//     home_address_2 VARCHAR(1000),
//     country VARCHAR(200),
//     state VARCHAR(200),
//     city VARCHAR(200),
//     employment_status VARCHAR(200),
//     aadhar_card_no VARCHAR(100),
//     pan_card_no VARCHAR(200),
//     passport_no VARCHAR(200),
//     biometric_details VARCHAR(200),
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//     )`);
// await client.query(`CREATE TABLE IF NOT EXISTS adhaar_details(
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL,
//         first_name VARCHAR(200),
//         middle_name VARCHAR(200),
//         last_name VARCHAR(200),
//         gender VARCHAR(200),
//         date_of_birth VARCHAR(200),
//         address VARCHAR(1000),
//         mobile_number VARCHAR(200),
//         email VARCHAR(200),
//         biometric_data VARCHAR(200),
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// )`);
// await client.query(`CREATE TABLE IF NOT EXISTS voter_id_details(
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL,
//         first_name VARCHAR(200),
//         middle_name VARCHAR(200),
//         last_name VARCHAR(200),
//         date_of_birth VARCHAR(200),
//         home_address VARCHAR(1000),
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// )`);
// await client.query(`CREATE TABLE IF NOT EXISTS pan_card_details(
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL,
//         first_name VARCHAR(200),
//         middle_name VARCHAR(200),
//         last_name VARCHAR(200),
//         date_of_birth VARCHAR(200),
//         home_address VARCHAR(1000),
//         email VARCHAR(200),
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// )`);
// await client.query(`CREATE TABLE IF NOT EXISTS driving_license_details(
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL,
//         first_name VARCHAR(200),
//         middle_name VARCHAR(200),
//         last_name VARCHAR(200),
//         date_of_birth VARCHAR(200),
//         address VARCHAR(1000),
//         medicalCertificate VARCHAR(200),
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// )`);
// await client.query(`CREATE TABLE IF NOT EXISTS passport_details(
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL,
//         first_name VARCHAR(200),
//         middle_name VARCHAR(200),
//         last_name VARCHAR(200),
//         date_of_birth VARCHAR(200),
//         home_address VARCHAR(1000),
//         birthCertificate VARCHAR(200),
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// )`);

// await client.query(`CREATE TABLE IF NOT EXISTS marksheet_details(
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER NOT NULL,
//         first_name VARCHAR(200),
//         middle_name VARCHAR(200),
//         last_name VARCHAR(200),
//         date_of_birth VARCHAR(200),
//         schoolName VARCHAR(1000),
//         currentClass VARCHAR(200),
//         rollNumber VARCHAR(200),
//         marks VARCHAR(200),
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// )`);


export default client;