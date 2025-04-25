function relativeTimeModifier(expression) {
    const regEx = /^now\(\)(([+-](\d+)(mon|s|m|h|d|y))*)(\@(mon|s|m|h|d|y))?$/;
    const match = expression.match(regEx);
  
    if (!match) {
      throw new Error("Invalid format. Expected format: now() with optional + (e.g., now()+3d-2m@h)");
    }
    
    const operations = [...expression.matchAll(/([+-])(\d+)(mon|s|m|h|d|y)/g)];
    const snapMatch = expression.match(/\@(mon|s|m|h|d|y)/);
    const snapUnit = snapMatch? snapMatch[1] : null;
  
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
  
    operations.forEach(([, sign , amountStr, unit]) =>  {
      const amount = parseInt(amountStr, 10)*(sign ==='-'? -1:1);
    
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
    

    if (snapUnit) {
      switch (snapUnit) {
        case 's':
          utcDate.setUTCMilliseconds(0);
          break;
        case 'm':
          utcDate.setUTCSeconds(0,0);
          break;
        case 'h':
          utcDate.setUTCMinutes(0,0,0);
          break;
        case 'd':
          utcDate.setUTCHours(0,0,0,0);
          break;
        case 'mon':
          utcDate.setUTCDate(1);
          utcDate.setUTCHours(0,0,0,0);
          break;
        case 'y':
          utcDate.setUTCMonth(0,1);
          utcDate.setUTCHours(0,0,0,0);
          break;
        default:
          throw new Error("Unsupported snap unit.");
      }
    }
    
    return utcDate;
  }
