let config = {}

// Application
config.application = {};
config.application.MODE = 'production';
config.application.PORT = 10000;
config.application.public_folder = '/public/dist';
config.application.resources_folder = '/resources';

// Application -> Security
config.application.security = {};
config.application.security.token = {};
config.application.security.token.secret = 'p@ssw0rd';
config.application.security.token.expire = 86400; // In seconds (24 hours)

// Application -> Security -> Encryption
config.application.security.encryption = {};
config.application.security.encryption.salt_factor = 10;

// Application -> Security -> Header
config.application.security.header = {};

// Application -> Security -> Header -> Key
config.application.security.header.keys = {};
config.application.security.header.keys.token = 'Token';

// Application -> Route
config.application.route = {};
config.application.route.prefix = '/api';

// Application -> Modules
config.application.modules = {};

// Application -> Modules -> User
config.application.modules.user = {};
config.application.modules.user.path = './resources/users/';
config.application.modules.user.photo = {};
config.application.modules.user.photo.field_name = 'file';
config.application.modules.user.photo.folder = 'photo';
config.application.modules.user.photo.mime_type = [ 'image/jpeg', 'image/png' ];
config.application.modules.user.photo.size_limit = 1;
config.application.modules.user.photo.size_limit_unit = 'MB';

// Database
config.database = {}
//config.database.uri = 'mongodb://localhost:27017/db';
config.database.uri = 'mongodb://admin:admin@ds145193.mlab.com:45193/location-bookmark';

module.exports = config;