namespace Ntay.Models;

public class Bank
{
    public int Id { get; set; }
    public required string Name { get; set; }

    // public ICollection<BankAccount> Accounts { get; set; } = new List<BankAccount>();
}
