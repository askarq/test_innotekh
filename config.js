export const options1 = {
  vus: 2,           // 2 виртуальных пользователя
  iterations: 2,    // 2 итерации
  
};


export const options2 = {
  stages: [
    { duration: '10s', target: 0 }, // Первый stage: 0 пользователей в течение 10 секунд
    { duration: '10s', target: 2 } // Второй stage: 2 пользователя в течение 10 секунд

  ],

  
};

