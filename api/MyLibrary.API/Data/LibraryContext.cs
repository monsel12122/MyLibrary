
using Microsoft.EntityFrameworkCore;
using MyLibrary.API.Models;

namespace MyLibrary.API.Data;

public class LibraryContext : DbContext
{
    public LibraryContext(DbContextOptions<LibraryContext> options)
        : base(options)
    {
    }

    public DbSet<Book> Books { get; set; }
}
