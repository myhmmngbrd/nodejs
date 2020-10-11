const fs = require('fs');
const fspromise = fs.promises;
const path = require('path');
const http = require('http');
const mysql = require('mysql2/promise');

const pool = mysql