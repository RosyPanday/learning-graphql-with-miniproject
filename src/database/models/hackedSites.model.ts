import { DataTypes, Model, Sequelize, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";



class HackedSites extends Model<InferAttributes<HackedSites>, InferCreationAttributes<HackedSites>> {
      declare id: CreationOptional<string>;
      declare siteName:string;
        declare siteDescription:string;
        declare siteHackedYear:number;
    declare hackerId:CreationOptional<string>;

        static associate(models:any) {
            HackedSites.belongsTo(models.Hackers,{
                foreignKey:"hackerId",
                as : "hackers"
            })
        }
}

export const initHackedSitesModel =(sequelize:Sequelize) :typeof HackedSites =>{
    HackedSites.init({
           id: {
               type: DataTypes.UUID,
               defaultValue:DataTypes.UUIDV4,
                primaryKey:true
           },
           siteName:{
             type: DataTypes.STRING,
             allowNull:false,
           },
              siteDescription:{
                type:DataTypes.STRING,
                allowNull:false,
              },
                siteHackedYear:{
                    type:DataTypes.INTEGER,
                    allowNull:false,
                },
                hackerId:{
                    type:DataTypes.UUID,
                    allowNull:false,
                }


    },{
        sequelize,
        modelName:'HackedSites',
        tableName:"table_hacked_sites",
        timestamps:true,
    });
    return HackedSites;
}