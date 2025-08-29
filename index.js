const express = require('express');
const app = express();
app.use(express.json());

// Read config from environment variables (safer than hardcoding)
const FULL_NAME = (process.env.FULL_NAME || "harshit_ambwani").toLowerCase();
const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "22062004";
const EMAIL = process.env.EMAIL || "harshitambwani86@gmail.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "22BCE10076";

const PORT = process.env.PORT || 3000;

function isIntegerString(s) {
return /^-?\d+$/.test(s);
}
function isAlphabeticString(s) {
return /^[A-Za-z]+$/.test(s);
}

app.post('/bfhl', (req, res) => {
try {
const input = req.body;
if (!input || !Array.isArray(input.data)) {
return res.status(400).json({
is_success: false,
message: "Invalid request: expected JSON body with 'data' array"
});
}

const rawArr = input.data;
const even_numbers = [];
const odd_numbers = [];
const alphabets = [];
const special_characters = [];
let sum = 0;
const alphaChars = []; // for concat_string

for (let item of rawArr) {
const s = String(item);

if (isIntegerString(s)) {
const num = parseInt(s, 10);
sum += num;
if (Math.abs(num) % 2 === 0) even_numbers.push(String(s));
else odd_numbers.push(String(s));
} else if (isAlphabeticString(s)) {
alphabets.push(s.toUpperCase());
for (let ch of s) alphaChars.push(ch);
} else {
special_characters.push(s);
}
}

const reversedChars = alphaChars.slice().reverse();
const alternated = reversedChars.map((ch, idx) =>
idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()
).join('');

const response = {
is_success: true,
user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
email: EMAIL,
roll_number: ROLL_NUMBER,
odd_numbers,
even_numbers,
alphabets,
special_characters,
sum: String(sum),
concat_string: alternated
};

res.status(200).json(response);
} catch (err) {
console.error(err);
res.status(500).json({ is_success: false, message: "Internal server error" });
}
});

app.get('/', (req, res) => res.send('bfhl API running. POST /bfhl'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
