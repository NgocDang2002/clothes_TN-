module.exports  = {
    mutipleMongooseToObject: function(mongoose){
        return mongoose.map(mongoose => mongoose.toObject());
    },
    mongooseToObject: function(mongoose){
        if (!mongoose) {
            return null; // hoặc bạn có thể trả về một giá trị mặc định khác phù hợp với ứng dụng của bạn
        }
        return mongoose.toObject() ? mongoose.toObject() : mongoose;
    },
};