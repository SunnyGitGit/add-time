function relativeTimeModifier(expression) {
    const regEx = /^now\(\)((\+(\d+)(mon|s|m|h|d|y))*)$/;
    const match = expression.match(regEx);
  
    if (!match) {
      throw new Error("Invalid format. Expected format: now() with optional + (e.g., now()+3d)");
    }
    
    const operations = [...expression.matchAll(/\+(\d+)(mon|s|m|h|d|y)/g)];
  
    const now = new Date();
    const utcDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    ));
  
    operations.forEach(([, amountStr, unit]) =>  {
      const amount = parseInt(amountStr);
    
      switch (unit) {
        case 's':
          utcDate.setUTCSeconds(utcDate.getUTCSeconds() + amount);
          break;
        case 'm':
          utcDate.setUTCMinutes(utcDate.getUTCMinutes() + amount);
          break;
        case 'h':
          utcDate.setUTCHours(utcDate.getUTCHours() + amount);
          break;
        case 'd':
          utcDate.setUTCDate(utcDate.getUTCDate() + amount);
          break;
        case 'mon':
          utcDate.setUTCMonth(utcDate.getUTCMonth() + amount);
          break;
        case 'y':
          utcDate.setUTCFullYear(utcDate.getUTCFullYear() + amount);
          break;
        default:
          throw new Error("Unsupported time unit.");
      }
    });
    
    return utcDate;
  }
