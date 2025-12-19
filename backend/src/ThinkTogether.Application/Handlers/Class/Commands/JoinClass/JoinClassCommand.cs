using MediatR;
using ThinkTogether.Application.DTOs;

namespace ThinkTogether.Application.Handlers.Class.Commands.JoinClass;

public sealed record JoinClassCommand(
    string JoinCode) : IRequest<ClassDto>;
