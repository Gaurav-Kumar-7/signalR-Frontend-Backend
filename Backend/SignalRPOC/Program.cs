using Microsoft.EntityFrameworkCore;
using SignalRPOC.Data;
using SignalRPOC.NewFolder;

var builder = WebApplication.CreateBuilder(args);
//builder.Services.AddSignalR()
//    .AddAzureSignalR("Endpoint=https://my-signalr-poc.service.signalr.net;AccessKey=D9i4rKSZbwl8LogslRuVtwWccgCfDgr5h8MmnV9sYD3kSDluaqTxJQQJ99BDACYeBjFXJ3w3AAAAASRS15dZ;Version=1.0;");
//builder.Services.AddSignalR()
//    .AddJsonProtocol(options =>
//    {
//        options.PayloadSerializerOptions.PropertyNamingPolicy = null;
//    })
//    .AddStackExchangeRedis("localhost:6379,abortConnect=false");
builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.PropertyNamingPolicy = null;
    })
    .AddSqlServer(options =>
    {
        options.ConnectionString = builder.Configuration.GetConnectionString("SignalRConnection");
    });

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Allow only Angular app
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();  // Allow credentials (cookies, authorization headers, etc.)
    });
});

var app = builder.Build();
app.UseCors("AllowSpecificOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<BroadcastHub>("/broadcastHub");

app.Run();
