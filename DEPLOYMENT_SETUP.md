# Verde Luxe Deployment Setup Guide

## Environment Variables Required

### Database Configuration
```bash
DATABASE_URL=postgresql://neondb_owner:npg_9zsuHtE3NGjI@ep-round-dawn-a2u068xy.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Optional PostgreSQL Variables (if needed separately)
```bash
PGHOST=ep-round-dawn-a2u068xy.eu-central-1.aws.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_9zsuHtE3NGjI
PGPORT=5432
```

### Application Configuration
```bash
NODE_ENV=production
PORT=5000
```

## Quick Setup for Different Environments

### For Render.com or similar platforms:
1. Add the DATABASE_URL environment variable in your dashboard
2. Set NODE_ENV=production
3. Deploy the application

### For local development:
1. Create a `.env` file in the root directory
2. Add all the environment variables listed above
3. Run `npm install` and `npm run dev`

### For other cloud platforms:
1. Add the DATABASE_URL as an environment variable
2. Ensure the platform supports Node.js applications
3. Set the start command to `npm run dev` or `npm start`

## Database Connection Details

**Host:** ep-round-dawn-a2u068xy.eu-central-1.aws.neon.tech  
**Database:** neondb  
**Username:** neondb_owner  
**Password:** npg_9zsuHtE3NGjI  
**Port:** 5432  
**SSL Mode:** require

## Troubleshooting

### "DATABASE_URL is not set" error:
- Ensure the DATABASE_URL environment variable is properly set
- Check that the database URL format is correct
- Verify the database is accessible from your deployment environment

### Database connection issues:
- Ensure SSL mode is enabled (sslmode=require)
- Check if the database service is running
- Verify network connectivity to the database host

### Performance optimization:
- Use connection pooling for production environments
- Enable database query optimization
- Monitor database performance metrics

## Security Notes

- The database credentials are exposed for deployment purposes
- Consider using environment-specific databases for production
- Rotate database credentials regularly
- Monitor database access logs

## Support

For issues with deployment or database connectivity, ensure:
1. All environment variables are properly set
2. Network connectivity to the database host
3. Correct SSL configuration
4. Database service is running and accessible