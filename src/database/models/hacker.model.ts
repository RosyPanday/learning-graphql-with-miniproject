
import { DataTypes, Model, Sequelize, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";

class Hackers extends Model<InferAttributes<Hackers>, InferCreationAttributes<Hackers>> {
      declare id:CreationOptional<string>;
        declare hackerName:string;

        static associate(models:any) {
              Hackers.hasMany(models.HackedSites, {
                foreignKey:"hackerId",
                as: "hackedSites",
              });
        }
}


export const initHackerModel = (sequelize:Sequelize):typeof Hackers => {
       Hackers.init({
             id :{
                 type:DataTypes.UUID,
                 defaultValue:DataTypes.UUIDV4,
                 primaryKey:true
             },
             hackerName :{
                type:DataTypes.STRING,
                allowNull:false,
             }
       },{
                sequelize,
                modelName:'Hackers',
                tableName:"table_hackers",
                timestamps:true,
       }
    
    );
    return Hackers;
};