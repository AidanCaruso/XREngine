import { Sequelize, DataTypes } from 'sequelize'
import { Application } from '../declarations'

export default (app: Application): any => {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const user = sequelizeClient.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true
    },
    created: { type: DataTypes.DATE }
  }, {
    hooks: {
      beforeCount (options: any) {
        options.raw = true
      }
    }
  });

  (user as any).associate = (models: any) => {
    (user as any).belongsTo(models.user_role, { foreignKey: 'userRole' });
    (user as any).belongsTo(models.instance); // user can only be in one room at a time
    (user as any).belongsTo(models.party, { through: 'party_user', foreignKey: 'userId' }); // user can only be part of one party at a time
    (user as any).hasMany(models.collection);
    (user as any).hasMany(models.entity);
    (user as any).hasMany(models.static_resource);
    (user as any).belongsToMany(models.user, { as: 'user', through: models.user_relationship });
    (user as any).belongsToMany(models.user, { as: 'relatedUser', through: models.user_relationship });
    (user as any).belongsToMany(models.group, { through: models.group_user }); // user can join multiple orgs
    (user as any).belongsToMany(models.group_user_rank, { through: models.group_user }); // user can join multiple orgs
    (user as any).hasMany(models.identity_provider)
  }

  return user
}
